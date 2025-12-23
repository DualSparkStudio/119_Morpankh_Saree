import { Router } from 'express';
import { getCart, addToCart, updateCart, removeFromCart, clearCart } from '../controllers/cart';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getCart);
router.post('/', addToCart);
router.put('/:itemId', updateCart);
router.delete('/:itemId', removeFromCart);
router.delete('/', clearCart);

export default router;

