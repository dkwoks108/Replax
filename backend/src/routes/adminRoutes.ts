import { Router } from 'express';
import { registerAdmin, loginAdmin, getAdminProfile, logoutAdmin } from '../controllers/adminController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/profile', protect, getAdminProfile);
router.post('/logout', protect, logoutAdmin);

export default router;
