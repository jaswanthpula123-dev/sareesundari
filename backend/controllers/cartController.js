const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { store } = require('../config/dataStore');

// Calculate saree price for drape option
const calculateWeightPrice = (basePrice, weight) => {
  if (weight === 'With Unstitched Blouse') return Math.round(basePrice * 1.05);
  if (weight === 'Custom Stitched Blouse') return Math.round(basePrice * 1.15);
  return basePrice;
};

// Helper to calculate totals
const calculateTotals = (items) => {
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.05); // 5% GST on Handloom Silk
  const shipping = subtotal >= 1999 || subtotal === 0 ? 0 : 150; // Free above ₹1,999
  const total = subtotal + tax + shipping;

  return { subtotal, tax, shipping, total };
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    if (global.__IS_MONGO_CONNECTED) {
      let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

      if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [] });
      }

      const formattedItems = cart.items.map(item => {
        if (!item.product) return null;
        return {
          _id: item._id,
          productId: item.product._id,
          name: item.product.name,
          slug: item.product.slug,
          image: item.product.images[0],
          weight: item.weight || '500g',
          price: item.price,
          originalPrice: item.product.price,
          stock: item.product.stock,
          quantity: item.quantity,
          category: item.product.category
        };
      }).filter(Boolean);

      const totals = calculateTotals(formattedItems);

      return res.json({
        success: true,
        cart: {
          items: formattedItems,
          ...totals
        }
      });
    } else {
      let cart = store.carts.find(c => c.user.toString() === req.user._id.toString());
      if (!cart) {
        cart = { user: req.user._id, items: [] };
        store.carts.push(cart);
      }

      const formattedItems = cart.items.map(item => {
        const prod = store.products.find(p => p._id.toString() === item.product.toString());
        if (!prod) return null;
        return {
          _id: item._id || item.product.toString() + '_' + (item.weight || '500g'),
          productId: prod._id,
          name: prod.name,
          slug: prod.slug,
          image: prod.images[0],
          weight: item.weight || '500g',
          price: item.price,
          originalPrice: prod.price,
          stock: prod.stock,
          quantity: item.quantity,
          category: prod.category
        };
      }).filter(Boolean);

      const totals = calculateTotals(formattedItems);

      return res.json({
        success: true,
        cart: {
          items: formattedItems,
          ...totals
        }
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, weight = '500g' } = req.body;
    const qty = Math.max(1, Number(quantity));

    if (global.__IS_MONGO_CONNECTED) {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Saree not found' });
      }

      const basePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
      const calculatedPrice = calculateWeightPrice(basePrice, weight);

      let cart = await Cart.findOne({ user: req.user._id });
      if (!cart) {
        cart = new Cart({ user: req.user._id, items: [] });
      }

      const existingIndex = cart.items.findIndex(
        item => item.product.toString() === productId.toString() && item.weight === weight
      );

      if (existingIndex > -1) {
        const newQty = cart.items[existingIndex].quantity + qty;
        if (newQty > product.stock) {
          return res.status(400).json({
            success: false,
            message: `Only ${product.stock} units available in stock`
          });
        }
        cart.items[existingIndex].quantity = newQty;
        cart.items[existingIndex].price = calculatedPrice;
      } else {
        if (qty > product.stock) {
          return res.status(400).json({
            success: false,
            message: `Only ${product.stock} units available in stock`
          });
        }
        cart.items.push({
          product: productId,
          weight,
          quantity: qty,
          price: calculatedPrice
        });
      }

      await cart.save();
      return getCart(req, res);
    } else {
      const product = store.products.find(p => p._id.toString() === productId.toString());
      if (!product) {
        return res.status(404).json({ success: false, message: 'Saree not found' });
      }

      const basePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
      const calculatedPrice = calculateWeightPrice(basePrice, weight);

      let cart = store.carts.find(c => c.user.toString() === req.user._id.toString());
      if (!cart) {
        cart = { user: req.user._id, items: [] };
        store.carts.push(cart);
      }

      const existingIndex = cart.items.findIndex(
        item => item.product.toString() === productId.toString() && item.weight === weight
      );

      if (existingIndex > -1) {
        const newQty = cart.items[existingIndex].quantity + qty;
        if (newQty > product.stock) {
          return res.status(400).json({
            success: false,
            message: `Only ${product.stock} units available in stock`
          });
        }
        cart.items[existingIndex].quantity = newQty;
        cart.items[existingIndex].price = calculatedPrice;
      } else {
        if (qty > product.stock) {
          return res.status(400).json({
            success: false,
            message: `Only ${product.stock} units available in stock`
          });
        }
        cart.items.push({
          product: productId,
          weight,
          quantity: qty,
          price: calculatedPrice
        });
      }

      return getCart(req, res);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update cart item quantity or weight
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity, weight, currentWeight } = req.body;
    const qty = quantity !== undefined ? Number(quantity) : undefined;

    if (global.__IS_MONGO_CONNECTED) {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Saree not found' });
      }

      let cart = await Cart.findOne({ user: req.user._id });
      if (!cart) {
        return res.status(404).json({ success: false, message: 'Cart not found' });
      }

      const matchWeight = currentWeight || weight;
      const itemIndex = cart.items.findIndex(
        item => item.product.toString() === productId.toString() && (!matchWeight || item.weight === matchWeight)
      );

      if (itemIndex === -1) {
        return res.status(404).json({ success: false, message: 'Item not in cart' });
      }

      if (qty !== undefined && qty <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        if (qty !== undefined) {
          if (qty > product.stock) {
            return res.status(400).json({
              success: false,
              message: `Only ${product.stock} units available in stock`
            });
          }
          cart.items[itemIndex].quantity = qty;
        }

        if (weight) {
          cart.items[itemIndex].weight = weight;
          const basePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
          cart.items[itemIndex].price = calculateWeightPrice(basePrice, weight);
        }
      }

      await cart.save();
      return getCart(req, res);
    } else {
      const product = store.products.find(p => p._id.toString() === productId.toString());
      if (!product) {
        return res.status(404).json({ success: false, message: 'Saree not found' });
      }

      let cart = store.carts.find(c => c.user.toString() === req.user._id.toString());
      if (!cart) {
        return res.status(404).json({ success: false, message: 'Cart not found' });
      }

      const matchWeight = currentWeight || weight;
      const itemIndex = cart.items.findIndex(
        item => item.product.toString() === productId.toString() && (!matchWeight || item.weight === matchWeight)
      );

      if (itemIndex === -1) {
        return res.status(404).json({ success: false, message: 'Item not in cart' });
      }

      if (qty !== undefined && qty <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        if (qty !== undefined) {
          if (qty > product.stock) {
            return res.status(400).json({
              success: false,
              message: `Only ${product.stock} units available in stock`
            });
          }
          cart.items[itemIndex].quantity = qty;
        }

        if (weight) {
          cart.items[itemIndex].weight = weight;
          const basePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
          cart.items[itemIndex].price = calculateWeightPrice(basePrice, weight);
        }
      }

      return getCart(req, res);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { weight } = req.query;

    if (global.__IS_MONGO_CONNECTED) {
      let cart = await Cart.findOne({ user: req.user._id });
      if (cart) {
        cart.items = cart.items.filter(item => {
          if (item.product.toString() !== productId.toString()) return true;
          if (weight && item.weight !== weight) return true;
          return false;
        });
        await cart.save();
      }
      return getCart(req, res);
    } else {
      let cart = store.carts.find(c => c.user.toString() === req.user._id.toString());
      if (cart) {
        cart.items = cart.items.filter(item => {
          if (item.product.toString() !== productId.toString()) return true;
          if (weight && item.weight !== weight) return true;
          return false;
        });
      }
      return getCart(req, res);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    if (global.__IS_MONGO_CONNECTED) {
      let cart = await Cart.findOne({ user: req.user._id });
      if (cart) {
        cart.items = [];
        await cart.save();
      }
      return getCart(req, res);
    } else {
      let cart = store.carts.find(c => c.user.toString() === req.user._id.toString());
      if (cart) {
        cart.items = [];
      }
      return getCart(req, res);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};
