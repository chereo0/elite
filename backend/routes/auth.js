import { Router } from 'express';
import { register, login, getMe, googleAuth, facebookAuth } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', protect, getMe);
router.post('/google', googleAuth);
router.post('/facebook', facebookAuth);

export default router;
