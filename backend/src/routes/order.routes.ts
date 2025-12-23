import { Router } from 'express';
import {
    getOrders,
    getOrder,
    createOrder,
    updateOrderStatus,
    deleteOrder,
} from '../controllers/order.controller';
import { protect } from '../middleware/auth.middleware';
import { admin } from '../middleware/admin.middleware';

const router = Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/orders
router.get('/', getOrders);

// @route   GET /api/orders/:id
router.get('/:id', getOrder);

// @route   POST /api/orders
router.post('/', createOrder);

// @route   PUT /api/orders/:id (admin only)
router.put('/:id', admin, updateOrderStatus);

// @route   DELETE /api/orders/:id (admin only)
router.delete('/:id', admin, deleteOrder);

export default router;
