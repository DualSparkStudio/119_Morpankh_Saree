import { Router } from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth';
import {
  getAdminOrders,
  getAdminOrder,
  updateOrderStatus,
} from '../../controllers/admin/orders';

const router = Router();

router.use(authenticate);
router.use(requireAdmin);

router.get('/', getAdminOrders);
router.get('/:id', getAdminOrder);
router.patch('/:id/status', updateOrderStatus);

export default router;

