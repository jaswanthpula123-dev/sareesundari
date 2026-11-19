const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const { store, generateId } = require('../config/dataStore');

// @desc    Get admin dashboard overall stats & sales analytics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    if (global.__IS_MONGO_CONNECTED) {
      const totalProducts = await Product.countDocuments();
      const totalOrders = await Order.countDocuments();
      const totalUsers = await User.countDocuments({ role: 'user' });

      const lowStockProducts = await Product.countDocuments({ stock: { $lte: 10 } });
      const outOfStockProducts = await Product.countDocuments({ stock: { $lte: 0 } });

      const allOrders = await Order.find();
      const totalRevenue = allOrders.reduce((acc, order) => {
        if (order.orderStatus !== 'Cancelled') {
          return acc + (order.totalPrice || 0);
        }
        return acc;
      }, 0);

      const recentOrders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(6)
        .populate('user', 'name email');

      // Category counts
      const categoryCounts = await Product.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]);

      return res.json({
        success: true,
        stats: {
          totalRevenue,
          totalOrders,
          totalProducts,
          totalCustomers: totalUsers,
          lowStockCount: lowStockProducts,
          outOfStockCount: outOfStockProducts,
          categoryBreakdown: categoryCounts.map(c => ({ category: c._id, count: c.count })),
          recentOrders
        }
      });
    } else {
      const totalProducts = store.products.length;
      const totalOrders = store.orders.length;
      const totalUsers = store.users.filter(u => u.role === 'user').length;

      const lowStockProducts = store.products.filter(p => p.stock <= 10 && p.stock > 0).length;
      const outOfStockProducts = store.products.filter(p => p.stock <= 0).length;

      const totalRevenue = store.orders.reduce((acc, o) => {
        if (o.orderStatus !== 'Cancelled') {
          return acc + (o.totalPrice || 0);
        }
        return acc;
      }, 0);

      const recentOrders = store.orders
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6)
        .map(order => {
          const u = store.users.find(user => user._id.toString() === order.user.toString());
          return {
            ...order,
            user: u ? { name: u.name, email: u.email } : order.user
          };
        });

      // Category breakdown
      const catMap = {};
      store.products.forEach(p => {
        catMap[p.category] = (catMap[p.category] || 0) + 1;
      });
      const categoryBreakdown = Object.keys(catMap).map(k => ({ category: k, count: catMap[k] }));

      return res.json({
        success: true,
        stats: {
          totalRevenue,
          totalOrders,
          totalProducts,
          totalCustomers: totalUsers,
          lowStockCount: lowStockProducts,
          outOfStockCount: outOfStockProducts,
          categoryBreakdown,
          recentOrders
        }
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders for admin
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrdersAdmin = async (req, res) => {
  try {
    const { status } = req.query;

    if (global.__IS_MONGO_CONNECTED) {
      let query = {};
      if (status && status !== 'All') {
        query.orderStatus = status;
      }

      const orders = await Order.find(query).sort({ createdAt: -1 }).populate('user', 'name email phone');
      return res.json({ success: true, count: orders.length, orders });
    } else {
      let orders = [...store.orders];
      if (status && status !== 'All') {
        orders = orders.filter(o => o.orderStatus === status);
      }
      orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const populated = orders.map(order => {
        const u = store.users.find(user => user._id.toString() === order.user.toString());
        return {
          ...order,
          user: u ? { name: u.name, email: u.email, phone: u.phone } : order.user
        };
      });

      return res.json({ success: true, count: populated.length, orders: populated });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note = '' } = req.body;

    const validStatuses = ['Placed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status' });
    }

    if (global.__IS_MONGO_CONNECTED) {
      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      order.orderStatus = status;
      if (status === 'Delivered') {
        order.deliveredAt = new Date();
        order.isPaid = true;
        order.paidAt = order.paidAt || new Date();
      }

      order.statusHistory.push({
        status,
        timestamp: new Date(),
        note: note || `Status changed to ${status} by sweet shop admin.`
      });

      await order.save();
      return res.json({ success: true, message: `Order status updated to ${status}`, order });
    } else {
      const order = store.orders.find(o => o._id.toString() === id || o.orderNumber === id);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      order.orderStatus = status;
      order.updatedAt = new Date();
      if (status === 'Delivered') {
        order.deliveredAt = new Date();
        order.isPaid = true;
        order.paidAt = order.paidAt || new Date();
      }

      if (!order.statusHistory) order.statusHistory = [];
      order.statusHistory.push({
        status,
        timestamp: new Date(),
        note: note || `Status changed to ${status} by sweet shop admin.`
      });

      return res.json({ success: true, message: `Order status updated to ${status}`, order });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new sweet product
// @route   POST /api/admin/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      price,
      discountPrice,
      weightOptions = ['250g', '500g', '1kg'],
      stock = 25,
      images,
      isFeatured = false,
      isBestSeller = false,
      isFestivalSpecial = false,
      pureGhee = true,
      isVeg = true,
      shelfLife = '15 Days',
      ingredients = 'Pure Desi Ghee, Sugar, Nuts'
    } = req.body;

    if (!name || !price || !category || !description) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const defaultImages = images && images.length > 0 ? images : [
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80'
    ];

    if (global.__IS_MONGO_CONNECTED) {
      const existing = await Product.findOne({ slug });
      const finalSlug = existing ? `${slug}-${Date.now().toString().slice(-4)}` : slug;

      const product = await Product.create({
        name,
        slug: finalSlug,
        category,
        description,
        price: Number(price),
        discountPrice: Number(discountPrice) || 0,
        weightOptions,
        stock: Number(stock) || 0,
        availability: Number(stock) > 0 ? 'In Stock' : 'Out of Stock',
        images: defaultImages,
        isFeatured: Boolean(isFeatured),
        isBestSeller: Boolean(isBestSeller),
        isFestivalSpecial: Boolean(isFestivalSpecial),
        pureGhee: Boolean(pureGhee),
        isVeg: Boolean(isVeg),
        shelfLife,
        ingredients,
        rating: 4.8,
        numReviews: 1
      });

      return res.status(201).json({ success: true, message: 'Sweet created successfully!', product });
    } else {
      const finalSlug = `${slug}-${Date.now().toString().slice(-4)}`;
      const numStock = Number(stock) || 0;

      const newProduct = {
        _id: generateId(),
        name,
        slug: finalSlug,
        category,
        description,
        price: Number(price),
        discountPrice: Number(discountPrice) || 0,
        discountPercentage: discountPrice > 0 ? Math.round(((price - discountPrice) / price) * 100) : 0,
        finalPrice: discountPrice > 0 ? Number(discountPrice) : Number(price),
        weightOptions,
        stock: numStock,
        availability: numStock > 0 ? 'In Stock' : 'Out of Stock',
        images: defaultImages,
        isFeatured: Boolean(isFeatured),
        isBestSeller: Boolean(isBestSeller),
        isFestivalSpecial: Boolean(isFestivalSpecial),
        pureGhee: Boolean(pureGhee),
        isVeg: Boolean(isVeg),
        shelfLife,
        ingredients,
        rating: 4.8,
        numReviews: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      store.products.unshift(newProduct);
      return res.status(201).json({ success: true, message: 'Sweet created successfully!', product: newProduct });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update sweet product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.stock !== undefined) {
      const stockNum = Number(updateData.stock);
      updateData.availability = stockNum <= 0 ? 'Out of Stock' : (stockNum <= 5 ? 'Few Left' : 'In Stock');
    }

    if (global.__IS_MONGO_CONNECTED) {
      const product = await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
      if (!product) {
        return res.status(404).json({ success: false, message: 'Sweet not found' });
      }
      return res.json({ success: true, message: 'Sweet updated successfully!', product });
    } else {
      const index = store.products.findIndex(p => p._id.toString() === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Sweet not found' });
      }

      store.products[index] = {
        ...store.products[index],
        ...updateData,
        updatedAt: new Date()
      };

      return res.json({ success: true, message: 'Sweet updated successfully!', product: store.products[index] });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete sweet product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (global.__IS_MONGO_CONNECTED) {
      const product = await Product.findByIdAndDelete(id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Sweet not found' });
      }
      return res.json({ success: true, message: 'Sweet removed from catalog' });
    } else {
      const index = store.products.findIndex(p => p._id.toString() === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Sweet not found' });
      }

      store.products.splice(index, 1);
      return res.json({ success: true, message: 'Sweet removed from catalog' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all registered customers
// @route   GET /api/admin/customers
// @access  Private/Admin
const getAllCustomers = async (req, res) => {
  try {
    if (global.__IS_MONGO_CONNECTED) {
      const customers = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });

      const customersWithStats = await Promise.all(
        customers.map(async (cust) => {
          const userOrders = await Order.find({ user: cust._id });
          const totalSpent = userOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
          return {
            ...cust.toObject(),
            ordersCount: userOrders.length,
            totalSpent
          };
        })
      );

      return res.json({ success: true, count: customersWithStats.length, customers: customersWithStats });
    } else {
      const customers = store.users.filter(u => u.role === 'user');

      const customersWithStats = customers.map(cust => {
        const userOrders = store.orders.filter(o => o.user.toString() === cust._id.toString());
        const totalSpent = userOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
        const { password, ...safeCust } = cust;
        return {
          ...safeCust,
          ordersCount: userOrders.length,
          totalSpent
        };
      });

      return res.json({ success: true, count: customersWithStats.length, customers: customersWithStats });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Fast restock product
// @route   PUT /api/admin/products/:id/restock
// @access  Private/Admin
const restockProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount = 25 } = req.body;

    if (global.__IS_MONGO_CONNECTED) {
      const product = await Product.findById(id);
      if (!product) return res.status(404).json({ success: false, message: 'Sweet not found' });

      product.stock += Number(amount);
      product.availability = product.stock > 0 ? 'In Stock' : 'Out of Stock';
      await product.save();

      return res.json({ success: true, message: `Restocked +${amount} boxes`, product });
    } else {
      const product = store.products.find(p => p._id.toString() === id);
      if (!product) return res.status(404).json({ success: false, message: 'Sweet not found' });

      product.stock += Number(amount);
      product.availability = product.stock > 0 ? 'In Stock' : 'Out of Stock';
      return res.json({ success: true, message: `Restocked +${amount} boxes`, product });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all products for admin
// @route   GET /api/admin/products
// @access  Private/Admin
const getAllProductsAdmin = async (req, res) => {
  try {
    if (global.__IS_MONGO_CONNECTED) {
      const products = await Product.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: products.length, products });
    } else {
      const products = store.products.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json({ success: true, count: products.length, products });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllProductsAdmin,
  getAllOrdersAdmin,
  updateOrderStatus,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllCustomers,
  getAllCustomersAdmin: getAllCustomers,
  restockProduct,
  updateStock: restockProduct
};
