import { Router } from 'express';
import { getProfile, updateProfile, getAddresses, addAddress, updateAddress, deleteAddress } from '../controllers/users';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/addresses', getAddresses);
router.post('/addresses', addAddress);
router.put('/addresses/:id', updateAddress);
router.delete('/addresses/:id', deleteAddress);

export default router;

