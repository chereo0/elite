import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Order from '../models/Order.js';
import User from '../models/User.js';

export const getDashboardStats = async (_req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments({ parent: null });
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();

    const latestUsers = await User.find({}).select('-password').sort({ createdAt: -1 }).limit(5);
    const latestOrders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 }).limit(5);

    const ordersByStatus = await Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);

    const lowStockProducts = await Product.find({ stock: { $lt: 10 } })
      .select('name stock image')
      .sort({ stock: 1 })
      .limit(5);

    const revenueResult = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    return res.json({
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
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
