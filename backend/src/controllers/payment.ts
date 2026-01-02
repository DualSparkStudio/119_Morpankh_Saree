import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import Razorpay from 'razorpay';
import { AppError } from '../middleware/errorHandler';
import { prisma } from '../config/database';

// Initialize Razorpay only if keys are provided
let razorpay: Razorpay | null = null;
const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

if (razorpayKeyId && razorpayKeySecret) {
  try {
    razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    });
  } catch (error) {
    console.warn('⚠️ Razorpay initialization failed:', error);
  }
} else {
  console.warn('⚠️ Razorpay keys not configured. Payment features will be disabled.');
  console.warn('⚠️ Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables in Render dashboard.');
}

export const createRazorpayOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!razorpay) {
      return next(new AppError('Payment gateway not configured. Please contact administrator.', 503));
    }

    const { amount, currency = 'INR', orderId } = req.body;

    if (!amount || amount < 1) {
      return next(new AppError('Valid amount is required', 400));
    }

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: orderId || `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to process payment verification
const processPaymentVerification = async (
  orderId: string,
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string | null
) => {
  // Find the order
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, payments: true },
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // Check if payment already exists (prevent duplicate processing)
  const existingPayment = await prisma.payment.findFirst({
    where: {
      orderId: order.id,
      razorpayPaymentId: razorpayPaymentId,
      status: 'PAID',
    },
  });

  if (existingPayment) {
    console.log(`Payment ${razorpayPaymentId} already processed for order ${orderId}`);
    // Still update order status if it's not already updated
    if (order.paymentStatus !== 'PAID' || order.status !== 'CONFIRMED') {
      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'PAID',
          status: 'CONFIRMED',
          paymentId: razorpayOrderId,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          payments: true,
        },
      });
      return { order: updatedOrder, payment: existingPayment, isNew: false };
    }
    return { order, payment: existingPayment, isNew: false };
  }

  // Create payment record
  const payment = await prisma.payment.create({
    data: {
      orderId: order.id,
      amount: order.total,
      method: 'RAZORPAY',
      status: 'PAID',
      razorpayOrderId: razorpayOrderId,
      razorpayPaymentId: razorpayPaymentId,
      razorpaySignature: razorpaySignature,
    },
  });

  // Update order payment status and order status
  const updatedOrder = await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentStatus: 'PAID',
      status: 'CONFIRMED', // Auto-confirm orders after successful payment
      paymentId: razorpayOrderId, // Store Razorpay order ID
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      payments: true,
    },
  });

  console.log(`✅ Payment verified and order confirmed: Order ${orderId}, Payment ${razorpayPaymentId}`);
  return { order: updatedOrder, payment, isNew: true };
};

export const verifyPayment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!orderId) {
      return next(new AppError('Order ID is required', 400));
    }

    if (!razorpayOrderId || !razorpayPaymentId) {
      return next(new AppError('Razorpay order ID and payment ID are required', 400));
    }

    // Verify Razorpay signature
    if (razorpayKeySecret && razorpaySignature) {
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', razorpayKeySecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      if (expectedSignature !== razorpaySignature) {
        console.error(`❌ Invalid payment signature for order ${orderId}`);
        return next(new AppError('Invalid payment signature', 400));
      }
    } else {
      console.warn(`⚠️ Razorpay secret not configured, skipping signature verification for order ${orderId}`);
    }

    const result = await processPaymentVerification(
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature || null
    );

    res.json({
      verified: true,
      message: result.isNew 
        ? 'Payment verified and order confirmed' 
        : 'Payment already processed, order status updated',
      order: result.order,
      payment: result.payment,
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    if (error instanceof AppError) {
      return next(error);
    }
    next(new AppError(error?.message || 'Payment verification failed', 500));
  }
};

// Razorpay webhook handler for payment events
export const razorpayWebhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const crypto = require('crypto');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || razorpayKeySecret;
    
    if (!webhookSecret) {
      console.warn('⚠️ Razorpay webhook secret not configured');
      return res.status(400).json({ error: 'Webhook secret not configured' });
    }

    const signature = req.headers['x-razorpay-signature'] as string;
    if (!signature) {
      return res.status(400).json({ error: 'Missing signature' });
    }

    // Verify webhook signature
    const body = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('❌ Invalid webhook signature');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = req.body;
    console.log(`📥 Razorpay webhook received: ${event.event}`);

    // Handle payment.captured event
    if (event.event === 'payment.captured') {
      const paymentEntity = event.payload.payment.entity;
      const orderEntity = event.payload.order.entity;

      const razorpayOrderId = orderEntity.id;
      const razorpayPaymentId = paymentEntity.id;

      // Find order by Razorpay order ID (stored in paymentId field)
      const order = await prisma.order.findFirst({
        where: {
          OR: [
            { paymentId: razorpayOrderId },
            { payments: { some: { razorpayOrderId: razorpayOrderId } } },
          ],
        },
        include: { payments: true },
      });

      if (!order) {
        console.error(`❌ Order not found for Razorpay order ID: ${razorpayOrderId}`);
        return res.status(404).json({ error: 'Order not found' });
      }

      try {
        await processPaymentVerification(
          order.id,
          razorpayOrderId,
          razorpayPaymentId,
          paymentEntity.notes?.signature || null
        );
        console.log(`✅ Webhook processed: Payment captured for order ${order.id}`);
      } catch (error: any) {
        console.error(`❌ Error processing webhook for order ${order.id}:`, error);
        // Don't fail the webhook - Razorpay will retry
        return res.status(500).json({ error: 'Error processing webhook' });
      }
    }

    // Handle payment.failed event
    if (event.event === 'payment.failed') {
      const paymentEntity = event.payload.payment.entity;
      const razorpayPaymentId = paymentEntity.id;

      // Find order by payment ID
      const order = await prisma.order.findFirst({
        where: {
          payments: { some: { razorpayPaymentId: razorpayPaymentId } },
        },
      });

      if (order) {
        await prisma.payment.updateMany({
          where: { razorpayPaymentId: razorpayPaymentId },
          data: { status: 'FAILED' },
        });
        console.log(`❌ Payment failed for order ${order.id}`);
      }
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    // Always return 200 to Razorpay to prevent retries for processing errors
    res.status(200).json({ error: 'Webhook processing failed' });
  }
};

export const getPaymentStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        payments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    res.json({
      orderId: order.id,
      paymentStatus: order.paymentStatus,
      status: order.status,
      payments: order.payments,
    });
  } catch (error) {
    next(error);
  }
};

