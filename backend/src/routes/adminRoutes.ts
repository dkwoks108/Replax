import { Router } from 'express';
import { registerAdmin, loginAdmin, getAdminProfile, logoutAdmin } from '../controllers/adminController';
import { auth as protect } from '../middleware/auth';

const router = Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/profile', protect, getAdminProfile);
router.post('/logout', protect, logoutAdmin);

export default router;
