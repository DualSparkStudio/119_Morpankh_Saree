import { Router } from 'express';
import { getReviews, createReview } from '../controllers/reviews';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/product/:productId', getReviews);
router.post('/', authenticate, createReview);

export default router;

