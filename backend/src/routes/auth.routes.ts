import { Router } from 'express';
import { register, login, getMe, googleAuth, facebookAuth } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// @route   POST /api/auth/register
router.post('/register', register);

// @route   POST /api/auth/login
router.post('/login', login);

// @route   GET /api/auth/me
router.get('/me', protect, getMe);

// @route   POST /api/auth/google
router.post('/google', googleAuth);

// @route   POST /api/auth/facebook
router.post('/facebook', facebookAuth);

export default router;
