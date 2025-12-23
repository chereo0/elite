import { Router } from 'express';
import {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../controllers/product.controller';
import { protect } from '../middleware/auth.middleware';
import { admin } from '../middleware/admin.middleware';

const router = Router();

// @route   GET /api/products
router.get('/', getProducts);

// @route   GET /api/products/:id
router.get('/:id', getProduct);

// @route   POST /api/products (protected, admin only)
router.post('/', protect, admin, createProduct);

// @route   PUT /api/products/:id (protected, admin only)
router.put('/:id', protect, admin, updateProduct);

// @route   DELETE /api/products/:id (protected, admin only)
router.delete('/:id', protect, admin, deleteProduct);

export default router;
