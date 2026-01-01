import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import Razorpay from 'razorpay';
import { AppError } from '../middleware/errorHandler';

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

export const verifyPayment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    // TODO: Implement Razorpay signature verification
    // const crypto = require('crypto');
    // const expectedSignature = crypto
    //   .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    //   .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    //   .digest('hex');

    // if (expectedSignature !== razorpaySignature) {
    //   return next(new AppError('Invalid payment signature', 400));
    // }

    res.json({ verified: true, message: 'Payment verified' });
  } catch (error) {
    next(error);
  }
};

export const getPaymentStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;

    // TODO: Get payment status from database
    res.json({ message: 'Payment status - to be implemented' });
  } catch (error) {
    next(error);
  }
};

