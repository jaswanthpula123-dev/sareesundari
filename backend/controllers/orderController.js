const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const { store, generateId } = require('../config/dataStore');

// Helper to generate readable Sweet Magic Order Number
const generateOrderNumber = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `SM-${dateStr}-${randomNum}`;
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod = 'Cash',
      couponApplied = '',
      discountAmount = 0
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.mobile || !shippingAddress.street) {
      return res.status(400).json({ success: false, message: 'Please provide full shipping details' });
    }

    // Calculate totals
    const itemsPrice = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const taxPrice = Math.round(itemsPrice * 0.05); // 5% GST
    const shippingPrice = itemsPrice >= 499 ? 0 : 49;
    const finalDiscount = Number(discountAmount) || 0;
    const totalPrice = Math.max(0, itemsPrice + taxPrice + shippingPrice - finalDiscount);

    if (global.__IS_MONGO_CONNECTED) {
      const order = await Order.create({
        orderNumber: generateOrderNumber(),
        user: req.user._id,
        orderItems: orderItems.map(item => ({
          product: item.product || item.productId,
          name: item.name,
          image: item.image,
          weight: item.weight || '500g',
          price: item.price,
          quantity: item.quantity
        })),
        shippingAddress: {
          fullName: shippingAddress.fullName,
          mobile: shippingAddress.mobile,
          email: shippingAddress.email || req.user.email,
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          pincode: shippingAddress.pincode
        },
        paymentMethod: paymentMethod === 'COD' ? 'Cash' : paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        discountAmount: finalDiscount,
        totalPrice,
        couponApplied,
        isPaid: paymentMethod === 'Online' || paymentMethod === 'UPI',
        paidAt: (paymentMethod === 'Online' || paymentMethod === 'UPI') ? new Date() : null,
        orderStatus: 'Placed',
        statusHistory: [
          {
            status: 'Placed',
            timestamp: new Date(),
            note: `Order confirmed via ${paymentMethod} payment option.`
          }
        ]
      });

      // Update sweet stock
      for (const item of orderItems) {
        const prodId = item.product || item.productId;
        await Product.findByIdAndUpdate(prodId, {
          $inc: { stock: -item.quantity }
        });
      }

      // Clear user cart
      await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

      return res.status(201).json({
        success: true,
        message: 'Order placed successfully!',
        order
      });
    } else {
      const newOrder = {
        _id: generateId(),
        orderNumber: generateOrderNumber(),
        user: req.user._id,
        orderItems: orderItems.map(item => ({
          product: item.product || item.productId,
          name: item.name,
          image: item.image,
          weight: item.weight || '500g',
          price: item.price,
          quantity: item.quantity
        })),
        shippingAddress: {
          fullName: shippingAddress.fullName,
          mobile: shippingAddress.mobile,
          email: shippingAddress.email || req.user.email,
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          pincode: shippingAddress.pincode
        },
        paymentMethod: paymentMethod === 'COD' ? 'Cash' : paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        discountAmount: finalDiscount,
        totalPrice,
        couponApplied,
        isPaid: paymentMethod === 'Online' || paymentMethod === 'UPI',
        paidAt: (paymentMethod === 'Online' || paymentMethod === 'UPI') ? new Date() : null,
        orderStatus: 'Placed',
        statusHistory: [
          {
            status: 'Placed',
            timestamp: new Date(),
            note: `Order confirmed via ${paymentMethod} payment option.`
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      store.orders.unshift(newOrder);

      // Decrement stock in memory
      for (const item of orderItems) {
        const prodId = (item.product || item.productId).toString();
        const p = store.products.find(prod => prod._id.toString() === prodId);
        if (p) {
          p.stock = Math.max(0, p.stock - item.quantity);
          if (p.stock === 0) p.availability = 'Out of Stock';
          else if (p.stock < 5) p.availability = 'Few Left';
        }
      }

      // Clear user cart
      const cart = store.carts.find(c => c.user.toString() === req.user._id.toString());
      if (cart) {
        cart.items = [];
      }

      return res.status(201).json({
        success: true,
        message: 'Order placed successfully!',
        order: newOrder
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (global.__IS_MONGO_CONNECTED) {
      let order = await Order.findById(id).populate('user', 'name email phone');
      if (!order) {
        order = await Order.findOne({ orderNumber: id }).populate('user', 'name email phone');
      }

      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      // Authorization check (admin or owner)
      if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
      }

      return res.json({ success: true, order });
    } else {
      const order = store.orders.find(o => o._id.toString() === id || o.orderNumber === id);

      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      if (req.user.role !== 'admin' && order.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
      }

      const user = store.users.find(u => u._id.toString() === order.user.toString());
      const populatedOrder = {
        ...order,
        user: user ? { _id: user._id, name: user.name, email: user.email, phone: user.phone } : order.user
      };

      return res.json({ success: true, order: populatedOrder });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    if (global.__IS_MONGO_CONNECTED) {
      const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
      return res.json({ success: true, count: orders.length, orders });
    } else {
      const orders = store.orders
        .filter(o => o.user.toString() === req.user._id.toString())
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json({ success: true, count: orders.length, orders });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order to paid (for online payment / cash collected)
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
  try {
    const { id } = req.params;

    if (global.__IS_MONGO_CONNECTED) {
      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentResult = {
        id: req.body.id || `PAY_${Date.now()}`,
        status: req.body.status || 'COMPLETED',
        updateTime: new Date().toISOString(),
        emailAddress: req.body.emailAddress || req.user.email
      };

      await order.save();
      return res.json({ success: true, message: 'Payment recorded', order });
    } else {
      const order = store.orders.find(o => o._id.toString() === id || o.orderNumber === id);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentResult = {
        id: req.body.id || `PAY_${Date.now()}`,
        status: req.body.status || 'COMPLETED',
        updateTime: new Date().toISOString(),
        emailAddress: req.body.emailAddress || req.user.email
      };
      order.updatedAt = new Date();

      return res.json({ success: true, message: 'Payment recorded', order });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getMyOrders,
  updateOrderToPaid
};
