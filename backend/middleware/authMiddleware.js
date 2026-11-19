const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { store } = require('../config/dataStore');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'saree_sundari_super_secret_jwt_key_2026_royal_luxury'
      );

      if (global.__IS_MONGO_CONNECTED) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        const found = store.users.find(u => u._id.toString() === decoded.id.toString());
        if (found) {
          const { password, ...safeUser } = found;
          req.user = safeUser;
        }
      }

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found or token invalid' });
      }

      return next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  } else {
    return res.status(403).json({ success: false, message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, admin };
