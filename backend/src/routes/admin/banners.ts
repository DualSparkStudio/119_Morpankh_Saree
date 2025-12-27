import { Router } from 'express';
import {
  getAdminBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
} from '../../controllers/admin/banners';
import { uploadSingle } from '../../middleware/upload';
import { authenticate, requireAdmin } from '../../middleware/auth';

const router = Router();

router.use(authenticate);
router.use(requireAdmin);

router.get('/', getAdminBanners);
router.get('/:id', getBannerById);
router.post('/', uploadSingle('image'), createBanner);
router.put('/:id', uploadSingle('image'), updateBanner);
router.delete('/:id', deleteBanner);

export default router;

