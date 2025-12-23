import { Router } from 'express';
import { validateCoupon } from '../controllers/coupons';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.post('/validate', validateCoupon);

export default router;

