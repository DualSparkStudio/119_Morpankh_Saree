import { Router } from 'express';
import { createOrder, getOrders, getOrder, getOrderByNumber, updateOrderStatus } from '../controllers/orders';
import { authenticate, optionalAuthenticate } from '../middleware/auth';

const router = Router();

// Guest checkout - optional authentication for order creation
router.post('/', optionalAuthenticate, createOrder);

// Get order by order number (supports guest checkout)
router.get('/number/:orderNumber', optionalAuthenticate, getOrderByNumber);

// Get order by ID (supports guest checkout for order success page)
router.get('/:id', optionalAuthenticate, getOrder);

// Authenticated routes - require login
router.use(authenticate);
router.get('/', getOrders);
router.patch('/:id/status', updateOrderStatus);

export default router;

