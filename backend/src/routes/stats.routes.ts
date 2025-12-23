import { Router } from 'express';
import { getDashboardStats } from '../controllers/stats.controller';
import { protect } from '../middleware/auth.middleware';
import { admin } from '../middleware/admin.middleware';

const router = Router();

// @route   GET /api/stats
router.get('/', protect, admin, getDashboardStats);

export default router;
