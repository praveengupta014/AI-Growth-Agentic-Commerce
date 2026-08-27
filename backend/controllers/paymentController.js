const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Audit = require('../models/Audit');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  try {
    const { amount, products, userId, shippingAddress } = req.body;
    
    // Create order in Razorpay
    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise for INR)
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };
    
    const razorpayOrder = await razorpay.orders.create(options);
    
    const newOrder = await Order.create({
      user: userId,
      products,
      totalAmount: amount,
      razorpayOrderId: razorpayOrder.id,
      shippingAddress,
      status: 'created'
    });
    
    res.json({
      id: razorpayOrder.id,
      currency: razorpayOrder.currency,
      amount: razorpayOrder.amount,
      dbOrderId: newOrder._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = req.body;
    
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");
      
    const isAuthentic = expectedSignature === razorpay_signature;
    
    if (isAuthentic) {
      await Order.findByIdAndUpdate(dbOrderId, {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'processing' // change to processing upon successful payment
      });
      
      // Log to Audit
      await Audit.create({
        action: 'PRODUCT_PURCHASE',
        details: { dbOrderId, razorpay_payment_id }
      });
      
      res.json({
        success: true,
        reference: razorpay_payment_id
      });
    } else {
      await Order.findByIdAndUpdate(dbOrderId, {
        status: 'failed'
      });
      res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
