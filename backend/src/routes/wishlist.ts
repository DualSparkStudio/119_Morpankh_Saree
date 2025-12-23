import { Router } from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlist';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getWishlist);
router.post('/', addToWishlist);
router.delete('/:productId', removeFromWishlist);

export default router;

