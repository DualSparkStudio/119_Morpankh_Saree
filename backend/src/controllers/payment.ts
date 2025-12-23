import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import Razorpay from 'razorpay';
import { AppError } from '../middleware/errorHandler';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export const createRazorpayOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
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

