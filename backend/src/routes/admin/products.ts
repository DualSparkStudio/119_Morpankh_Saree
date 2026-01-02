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

// Color management routes (using colorIndex instead of colorId)
router.post('/:id/colors', addProductColor);
router.put('/:id/colors/:colorIndex', updateProductColor);
router.delete('/:id/colors/:colorIndex', deleteProductColor);

export default router;

