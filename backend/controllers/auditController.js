const Audit = require('../models/Audit');
const User = require('../models/User');
const Order = require('../models/Order');

exports.getAudits = async (req, res) => {
  try {
    const audits = await Audit.find({}).sort({ createdAt: -1 }).populate('user', 'name email');
    res.json(audits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const totalInteractions = await Audit.countDocuments({ action: 'CHAT_INTERACTION' });
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const errorCount = await Audit.countDocuments({ action: 'AI_FAILURE' });
    
    // Format system health (e.g. if > 10 errors, status is Degraded)
    const systemHealth = errorCount > 10 ? 'Degraded' : 'Stable';
    
    // Fetch 10 most recent audits
    const recentAudits = await Audit.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name email');

    res.json({
      stats: {
        totalInteractions,
        activeAgents: totalUsers,
        totalOrders,
        systemHealth
      },
      recentAudits
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
