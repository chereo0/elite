import Order from '../models/Order.js';

export const getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = req.user?.role === 'admin' ? {} : { user: req.user?._id };

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('items.product', 'name image')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);

    return res.json({
      success: true,
      count: orders.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: orders,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name image price');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user?._id?.toString() !== req.user?._id?.toString() && req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    return res.json({ success: true, data: order });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, taxPrice, shippingPrice, totalPrice } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items' });
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

    return res.status(201).json({ success: true, data: order });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    if (status === 'paid') order.paidAt = new Date();
    if (status === 'delivered') order.deliveredAt = new Date();

    const updatedOrder = await order.save();
    return res.json({ success: true, data: updatedOrder });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    await order.deleteOne();
    return res.json({ success: true, message: 'Order deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
