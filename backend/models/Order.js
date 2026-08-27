const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
  },
  razorpayOrderId: {
    type: String,
  },
  razorpayPaymentId: {
    type: String,
  },
  razorpaySignature: {
    type: String,
  },
  shippingAddress: {
    street: String,
    city: String,
    postalCode: String
  },
  status: {
    type: String,
    enum: ['created', 'paid', 'failed', 'processing', 'shipped', 'delivered'],
    default: 'created',
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
