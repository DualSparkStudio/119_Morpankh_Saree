import { Router } from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth';
import {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
} from '../../controllers/admin/products';

const router = Router();

router.use(authenticate);
router.use(requireAdmin);

router.get('/', getAdminProducts);
router.post('/', createProduct);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;

