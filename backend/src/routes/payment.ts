import { Router } from 'express';
import { createRazorpayOrder, verifyPayment, getPaymentStatus, razorpayWebhook } from '../controllers/payment';
import { authenticate, optionalAuthenticate } from '../middleware/auth';
import { paymentRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// Webhook endpoint - no rate limiting or auth (Razorpay needs direct access)
router.post('/razorpay/webhook', razorpayWebhook);

// Apply rate limiting to other routes
router.use(paymentRateLimiter);

// Guest checkout - optional authentication for payment creation and verification
router.post('/razorpay/create-order', optionalAuthenticate, createRazorpayOrder);
router.post('/razorpay/verify', optionalAuthenticate, verifyPayment);

// Authenticated route for payment status
router.use(authenticate);
router.get('/:orderId/status', getPaymentStatus);

export default router;

