import { Request, Response } from 'express';
import Product from '../models/Product';
import Category from '../models/Category';
import Order from '../models/Order';
import User from '../models/User';

/**
 * @desc    Get dashboard stats
 * @route   GET /api/stats
 * @access  Private/Admin
 */
export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
    try {
        // Get counts
        const totalProducts = await Product.countDocuments();
        // Count only main categories (without parent)
        const totalCategories = await Category.countDocuments({ parent: null });
        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments();

        // Get latest users (last 5)
        const latestUsers = await User.find({})
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(5);

        // Get latest orders (last 5)
        const latestOrders = await Order.find({})
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(5);

        // Get revenue stats
        const revenueResult = await Order.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

        // Get orders by status
        const ordersByStatus = await Order.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Get low stock products (stock < 10)
        const lowStockProducts = await Product.find({ stock: { $lt: 10 } })
            .select('name stock image')
            .sort({ stock: 1 })
            .limit(5);

        res.json({
            success: true,
            data: {
                counts: {
                    products: totalProducts,
                    categories: totalCategories,
                    orders: totalOrders,
                    users: totalUsers,
                },
                revenue: totalRevenue,
                ordersByStatus,
                latestUsers,
                latestOrders,
                lowStockProducts,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
