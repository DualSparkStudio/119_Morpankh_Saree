import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth';
// Admin controllers will be implemented

const router = Router();

router.use(authenticate);
router.use(requireAdmin);

// Admin routes will be added here

export default router;

