import { Router } from 'express';
import {
  getCategories,
  getMainCategories,
  getCategory,
  getSubcategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = Router();

router.get('/', getCategories);
router.get('/main', getMainCategories);
router.get('/:id', getCategory);
router.get('/:id/subcategories', getSubcategories);
router.post('/', protect, admin, createCategory);
router.put('/:id', protect, admin, updateCategory);
router.delete('/:id', protect, admin, deleteCategory);

export default router;
