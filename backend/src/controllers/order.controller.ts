import { Request, Response } from 'express';
import Order from '../models/Order';
import { AuthRequest } from '../middleware/auth.middleware';
import { fixImageUrl } from '../utils/urlHelper';

/**
 * @desc    Get all orders (admin) or user orders
 * @route   GET /api/orders
 * @access  Private
 */
export const getOrders = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        // Admin gets all orders, user gets only their orders
        const query = req.user?.role === 'admin' ? {} : { user: req.user?._id };

        const orders = await Order.find(query)
            .populate('user', 'name email')
            .populate('items.product', 'name image')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Order.countDocuments(query);

        // Fix image URLs
        const ordersWithFixedUrls = orders.map(order => {
            const o = order.toObject();
            if (o.items) {
                o.items = o.items.map((item: any) => {
                    if (item.product && item.product.image) {
                        item.product.image = fixImageUrl(item.product.image, req);
                    }
                    return item;
                });
            }
            return o;
        });

        res.json({
            success: true,
            count: orders.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: ordersWithFixedUrls,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

/**
 * @desc    Get single order
 * @route   GET /api/orders/:id
 * @access  Private
 */
export const getOrder = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('items.product', 'name image price');

        if (!order) {
            res.status(404).json({
                success: false,
                message: 'Order not found',
            });
            return;
        }

        // Check if user owns the order or is admin
        if (order.user._id.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
            res.status(403).json({
                success: false,
                message: 'Not authorized to view this order',
            });
            return;
        }

        const o = order.toObject();
        if (o.items) {
            o.items = o.items.map((item: any) => {
                if (item.product && item.product.image) {
                    item.product.image = fixImageUrl(item.product.image, req);
                }
                return item;
            });
        }

        res.json({
            success: true,
            data: o,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

/**
 * @desc    Create order
 * @route   POST /api/orders
 * @access  Private
 */
export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { items, shippingAddress, paymentMethod, taxPrice, shippingPrice, totalPrice } = req.body;

        if (!items || items.length === 0) {
            res.status(400).json({
                success: false,
                message: 'No order items',
            });
            return;
        }

        const order = await Order.create({
            user: req.user?._id,
            items,
            shippingAddress,
            paymentMethod,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        res.status(201).json({
            success: true,
            data: order,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

/**
 * @desc    Update order status
 * @route   PUT /api/orders/:id
 * @access  Private/Admin
 */
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { status } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            res.status(404).json({
                success: false,
                message: 'Order not found',
            });
            return;
        }

        order.status = status;

        if (status === 'paid') {
            order.paidAt = new Date();
        }

        if (status === 'delivered') {
            order.deliveredAt = new Date();
        }

        const updatedOrder = await order.save();

        res.json({
            success: true,
            data: updatedOrder,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

/**
 * @desc    Delete order
 * @route   DELETE /api/orders/:id
 * @access  Private/Admin
 */
export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            res.status(404).json({
                success: false,
                message: 'Order not found',
            });
            return;
        }

        await order.deleteOne();

        res.json({
            success: true,
            message: 'Order deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
