const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
const generateToken = require('../utils/generateToken');
const { store, generateId } = require('../config/dataStore');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (global.__IS_MONGO_CONNECTED) {
      const userExists = await User.findOne({ email: cleanEmail });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists' });
      }

      const user = await User.create({
        name,
        email: cleanEmail,
        password,
        phone: phone || ''
      });

      return res.status(201).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          addresses: user.addresses,
          wishlist: user.wishlist
        },
        token: generateToken(user._id)
      });
    } else {
      const userExists = store.users.find(u => u.email === cleanEmail);
      if (userExists) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        _id: generateId(),
        name,
        email: cleanEmail,
        password: hashedPassword,
        phone: phone || '',
        role: 'user',
        addresses: [],
        wishlist: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      store.users.push(newUser);

      return res.status(201).json({
        success: true,
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          phone: newUser.phone,
          addresses: newUser.addresses,
          wishlist: newUser.wishlist
        },
        token: generateToken(newUser._id)
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server registration error' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (global.__IS_MONGO_CONNECTED) {
      const user = await User.findOne({ email: cleanEmail });

      if (user && (await user.matchPassword(password))) {
        return res.json({
          success: true,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            addresses: user.addresses,
            wishlist: user.wishlist
          },
          token: generateToken(user._id)
        });
      } else {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    } else {
      const user = store.users.find(u => u.email === cleanEmail);

      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          return res.json({
            success: true,
            user: {
              _id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              phone: user.phone,
              addresses: user.addresses || [],
              wishlist: user.wishlist || []
            },
            token: generateToken(user._id)
          });
        }
      }

      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server login error' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    if (global.__IS_MONGO_CONNECTED) {
      const user = await User.findById(req.user._id).select('-password').populate('wishlist');
      if (user) {
        return res.json({ success: true, user });
      }
      return res.status(404).json({ success: false, message: 'User not found' });
    } else {
      const user = store.users.find(u => u._id.toString() === req.user._id.toString());
      if (user) {
        const { password, ...safeUser } = user;
        const populatedWishlist = (safeUser.wishlist || []).map(id => 
          store.products.find(p => p._id.toString() === id.toString())
        ).filter(Boolean);

        return res.json({
          success: true,
          user: {
            ...safeUser,
            wishlist: populatedWishlist
          }
        });
      }
      return res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const { name, email, phone, password, address } = req.body;

    if (global.__IS_MONGO_CONNECTED) {
      const user = await User.findById(req.user._id);

      if (user) {
        user.name = name || user.name;
        user.email = email ? email.toLowerCase().trim() : user.email;
        user.phone = phone !== undefined ? phone : user.phone;

        if (password) {
          user.password = password;
        }

        if (address) {
          if (address.isDefault) {
            user.addresses.forEach(a => a.isDefault = false);
          }
          user.addresses.push(address);
        }

        const updatedUser = await user.save();

        return res.json({
          success: true,
          user: {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            phone: updatedUser.phone,
            addresses: updatedUser.addresses,
            wishlist: updatedUser.wishlist
          },
          token: generateToken(updatedUser._id)
        });
      }
      return res.status(404).json({ success: false, message: 'User not found' });
    } else {
      const userIndex = store.users.findIndex(u => u._id.toString() === req.user._id.toString());
      if (userIndex !== -1) {
        const user = store.users[userIndex];
        user.name = name || user.name;
        user.email = email ? email.toLowerCase().trim() : user.email;
        user.phone = phone !== undefined ? phone : user.phone;

        if (password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(password, salt);
        }

        if (address) {
          if (!user.addresses) user.addresses = [];
          if (address.isDefault) {
            user.addresses.forEach(a => a.isDefault = false);
          }
          user.addresses.push({
            _id: generateId(),
            ...address
          });
        }

        user.updatedAt = new Date();

        return res.json({
          success: true,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            addresses: user.addresses,
            wishlist: user.wishlist
          },
          token: generateToken(user._id)
        });
      }
      return res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Forgot Password request
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Please provide email address' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit code

  // Simulate reset code generation for instant testing
  return res.json({
    success: true,
    message: `A password reset code has been generated. Use code: ${resetCode}`,
    resetCode // Returned directly for easy testing in demo/development
  });
};

// @desc    Reset Password with code
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  const { email, resetCode, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ success: false, message: 'Please provide email and new password' });
  }

  const cleanEmail = email.toLowerCase().trim();

  if (global.__IS_MONGO_CONNECTED) {
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User with this email not found' });
    }
    user.password = newPassword;
    await user.save();
    return res.json({ success: true, message: 'Password reset successfully. You can now login.' });
  } else {
    const user = store.users.find(u => u.email === cleanEmail);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User with this email not found' });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    return res.json({ success: true, message: 'Password reset successfully. You can now login.' });
  }
};

// @desc    Toggle wishlist item
// @route   POST /api/auth/wishlist/toggle
// @access  Private
const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, message: 'ProductId is required' });
    }

    if (global.__IS_MONGO_CONNECTED) {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const index = user.wishlist.indexOf(productId);
      let added = false;
      if (index > -1) {
        user.wishlist.splice(index, 1);
        added = false;
      } else {
        user.wishlist.push(productId);
        added = true;
      }

      await user.save();
      const populated = await User.findById(req.user._id).populate('wishlist');

      return res.json({
        success: true,
        added,
        message: added ? 'Added to your royal wishlist' : 'Removed from wishlist',
        wishlist: populated.wishlist
      });
    } else {
      const user = store.users.find(u => u._id.toString() === req.user._id.toString());
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (!user.wishlist) user.wishlist = [];

      const strId = productId.toString();
      const index = user.wishlist.findIndex(id => id.toString() === strId);
      let added = false;

      if (index > -1) {
        user.wishlist.splice(index, 1);
        added = false;
      } else {
        user.wishlist.push(strId);
        added = true;
      }

      const populatedWishlist = user.wishlist.map(id =>
        store.products.find(p => p._id.toString() === id.toString())
      ).filter(Boolean);

      return res.json({
        success: true,
        added,
        message: added ? 'Added to your royal wishlist' : 'Removed from wishlist',
        wishlist: populatedWishlist
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
  toggleWishlist
};
