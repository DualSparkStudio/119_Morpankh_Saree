import { Router } from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth';
import {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  addProductColor,
  updateProductColor,
  deleteProductColor,
} from '../../controllers/admin/products';

const router = Router();

router.use(authenticate);
router.use(requireAdmin);

router.get('/', getAdminProducts);
router.post('/', createProduct);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

// Color management routes
router.post('/:id/colors', addProductColor);
router.put('/:id/colors/:colorId', updateProductColor);
router.delete('/:id/colors/:colorId', deleteProductColor);

export default router;

