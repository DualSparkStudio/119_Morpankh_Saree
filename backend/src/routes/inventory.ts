import { Router } from 'express';
import { scanStock, getStockLogs } from '../controllers/inventory';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.use(requireAdmin);

router.post('/scan', scanStock);
router.get('/logs', getStockLogs);

export default router;

