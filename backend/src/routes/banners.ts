import { Router } from 'express';
import { getBanners } from '../controllers/banners';

const router = Router();

router.get('/', getBanners);

export default router;

