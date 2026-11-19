let express, cors;
try {
  express = require('express');
} catch (e) {
  express = require('../backend/node_modules/express');
}
try {
  cors = require('cors');
} catch (e) {
  cors = require('../backend/node_modules/cors');
}

const { initStore } = require('../backend/config/dataStore');

// Route imports
const authRoutes = require('../backend/routes/authRoutes');
const productRoutes = require('../backend/routes/productRoutes');
const categoryRoutes = require('../backend/routes/categoryRoutes');
const cartRoutes = require('../backend/routes/cartRoutes');
const orderRoutes = require('../backend/routes/orderRoutes');
const adminRoutes = require('../backend/routes/adminRoutes');
const uploadRoutes = require('../backend/routes/uploadRoutes');

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let initialized = false;
app.use(async (req, res, next) => {
  if (!initialized) {
    try {
      await initStore();
      initialized = true;
    } catch (e) {
      console.error('Serverless store init notice:', e.message);
    }
  }
  next();
});

// Health check
app.get(['/api/health', '/health'], (req, res) => {
  res.json({
    status: 'online',
    app: 'Saree Sundarii API (Vercel Serverless)',
    totalProducts: 34,
    timestamp: new Date().toISOString()
  });
});

app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/products', '/products'], productRoutes);
app.use(['/api/categories', '/categories'], categoryRoutes);
app.use(['/api/cart', '/cart'], cartRoutes);
app.use(['/api/orders', '/orders'], orderRoutes);
app.use(['/api/admin', '/admin'], adminRoutes);
app.use(['/api/upload', '/upload'], uploadRoutes);

module.exports = app;
