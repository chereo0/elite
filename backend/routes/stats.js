import { Router } from 'express';
import { getDashboardStats } from '../controllers/statsController.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = Router();

router.get('/', protect, admin, getDashboardStats);

export default router;
