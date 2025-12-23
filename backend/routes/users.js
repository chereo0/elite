import { Router } from 'express';
import { getUsers, getUser, updateUser, deleteUser, updateProfile, changePassword } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = Router();

router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);

router.get('/', protect, admin, getUsers);
router.get('/:id', protect, admin, getUser);
router.put('/:id', protect, admin, updateUser);
router.delete('/:id', protect, admin, deleteUser);

export default router;
