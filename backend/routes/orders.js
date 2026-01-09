import { Router } from 'express';
import { getOrders, getOrder, createOrder, updateOrderStatus, deleteOrder } from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = Router();

router.use(protect);

router.get('/', getOrders);
router.get('/:id', getOrder);
router.post('/', createOrder);
router.put('/:id', admin, updateOrderStatus);
router.delete('/:id', admin, deleteOrder);

export default router;
