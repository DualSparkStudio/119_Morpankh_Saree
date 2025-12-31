import { Router } from 'express';
import { getSetting, getAllSettings, updateSetting } from '../controllers/settings';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// Public route - get a specific setting (e.g., tax_percentage)
router.get('/:key', getSetting);

// Admin routes
router.use(authenticate);
router.use(requireAdmin);
router.get('/', getAllSettings);
router.put('/:key', updateSetting);

export default router;

