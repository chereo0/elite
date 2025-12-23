import { Router } from 'express';
import {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    getMainCategories,
    getSubcategories,
} from '../controllers/category.controller';
import { protect } from '../middleware/auth.middleware';
import { admin } from '../middleware/admin.middleware';

const router = Router();

// @route   GET /api/categories
router.get('/', getCategories);

// @route   GET /api/categories/main (only main categories, no subcategories)
router.get('/main', getMainCategories);

// @route   GET /api/categories/:id
router.get('/:id', getCategory);

// @route   GET /api/categories/:id/subcategories
router.get('/:id/subcategories', getSubcategories);

// @route   POST /api/categories (protected, admin only)
router.post('/', protect, admin, createCategory);

// @route   PUT /api/categories/:id (protected, admin only)
router.put('/:id', protect, admin, updateCategory);

// @route   DELETE /api/categories/:id (protected, admin only)
router.delete('/:id', protect, admin, deleteCategory);

export default router;
