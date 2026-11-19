const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: { type: String, required: true },
  image: { type: String, required: true },
  weight: { type: String, default: '500g' },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 }
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    orderItems: [orderItemSchema],
    shippingAddress: {
      fullName: { type: String, required: true },
      mobile: { type: String, required: true },
      email: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true }
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['Cash', 'COD', 'Online', 'UPI', 'Card'],
      default: 'Cash'
    },
    paymentResult: {
      id: String,
      status: String,
      updateTime: String,
      emailAddress: String
    },
    itemsPrice: { type: Number, required: true, default: 0.0 },
    taxPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    discountAmount: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    couponApplied: { type: String, default: '' },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    orderStatus: {
      type: String,
      required: true,
      enum: ['Placed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Placed'
    },
    deliveredAt: { type: Date },
    statusHistory: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        note: { type: String, default: '' }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Order', orderSchema);
