import { Router } from 'express';
import { createRazorpayOrder, verifyPayment, getPaymentStatus } from '../controllers/payment';
import { authenticate } from '../middleware/auth';
import { paymentRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(authenticate);
router.use(paymentRateLimiter);

router.post('/razorpay/create-order', createRazorpayOrder);
router.post('/razorpay/verify', verifyPayment);
router.get('/:orderId/status', getPaymentStatus);

export default router;

