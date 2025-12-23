import { Router } from 'express';
import {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    updateProfile,
    changePassword
} from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';
import { admin } from '../middleware/admin.middleware';

const router = Router();

// Protected routes (require authentication only)
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);

// Admin only routes
router.get('/', protect, admin, getUsers);
router.get('/:id', protect, admin, getUser);
router.put('/:id', protect, admin, updateUser);
router.delete('/:id', protect, admin, deleteUser);

export default router;
