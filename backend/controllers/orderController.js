const Order = require('../models/Order');

// @desc    Submit a new customer order
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res, next) => {
  try {
    const { customerName, customerEmail, customerPhone, items, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cannot place an empty order' });
    }

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await Order.create({
      orderId,
      customerName: customerName || 'Valued Wholesale Client',
      customerEmail: customerEmail || '',
      customerPhone: customerPhone || '',
      items,
      totalAmount: Number(totalAmount) || 0,
      status: 'Confirmed'
    });

    res.status(201).json({
      success: true,
      message: 'Order submitted and logged successfully in MongoDB',
      order: {
        id: order.orderId,
        mongoId: order._id,
        customerName: order.customerName,
        items: order.items,
        totalAmount: order.totalAmount,
        status: order.status,
        date: order.date
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Public (or Admin protected)
const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: orders.length,
      orders: orders.map(o => ({
        id: o.orderId,
        mongoId: o._id,
        customerName: o.customerName,
        customerEmail: o.customerEmail,
        customerPhone: o.customerPhone,
        items: o.items,
        totalAmount: o.totalAmount,
        status: o.status,
        date: o.date
      }))
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders
};
