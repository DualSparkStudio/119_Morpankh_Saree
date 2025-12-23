import { Router } from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth';
import { getDashboardStats } from '../../controllers/admin/dashboard';

const router = Router();

router.use(authenticate);
router.use(requireAdmin);

router.get('/stats', getDashboardStats);

export default router;

