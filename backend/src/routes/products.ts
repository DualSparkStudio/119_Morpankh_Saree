import { Router } from 'express';
import { getProducts, getProduct, getProductBySlug } from '../controllers/products';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProduct);
router.get('/slug/:slug', getProductBySlug);

export default router;

