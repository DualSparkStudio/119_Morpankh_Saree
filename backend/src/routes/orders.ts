import { Router } from 'express';
import { createOrder, getOrders, getOrder, updateOrderStatus } from '../controllers/orders';
import { authenticate, optionalAuthenticate } from '../middleware/auth';

const router = Router();

// Guest checkout - optional authentication for order creation
router.post('/', optionalAuthenticate, createOrder);

// Authenticated routes - require login
router.use(authenticate);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.patch('/:id/status', updateOrderStatus);

export default router;

