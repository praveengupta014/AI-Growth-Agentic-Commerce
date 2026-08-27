const Order = require('../models/Order');

exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Fetch orders for user, sort by latest
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('products.product'); // if we have products populated, though our array just stores IDs
      
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
