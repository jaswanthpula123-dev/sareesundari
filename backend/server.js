const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');

// Load environment variables
dotenv.config();

const { connectDB } = require('./config/db');
const { initStore } = require('./config/dataStore');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve uploaded static files, authentic saree assets & legacy assets
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/sarees', express.static(path.join(__dirname, '../frontend/public/sarees')));
app.use('/sweets', express.static(path.join(__dirname, '../frontend/public/sweets')));

// Root & Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Sweet Magic API',
    tagline: 'Pure Desi Ghee & Handcrafted Indian Sweets',
    timestamp: new Date().toISOString(),
    mongoConnected: Boolean(global.__IS_MONGO_CONNECTED)
  });
});

app.get('/', (req, res) => {
  res.send('🍬 Sweet Magic – Full Stack Online Sweets Shop API is running gracefully.');
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Initialize Server and Database
const startServer = async () => {
  try {
    // 1. Initialize in-memory seed store
    await initStore();

    // 2. Start HTTP listener immediately
    const server = app.listen(PORT, () => {
      console.log(`🍬 Sweet Magic Backend Server running on http://localhost:${PORT}`);
    });

    // Keep event loop active indefinitely
    setInterval(() => {}, 1000 * 60 * 60);

    // 3. Connect to MongoDB if explicitly enabled or configured
    if (process.env.ENABLE_MONGO === 'true') {
      connectDB().then(async (conn) => {
        if (global.__IS_MONGO_CONNECTED) {
          const Category = require('./models/Category');
          const Product = require('./models/Product');
          const User = require('./models/User');
          const { categoriesData, productsData, getHashedUsers } = require('./seed/seedData');

          const count = await Product.countDocuments();
          if (count === 0) {
            console.log('🌱 Seeding MongoDB database with initial Sweet Magic collection...');
            await Category.deleteMany({});
            await Product.deleteMany({});
            await User.deleteMany({});

            await Category.insertMany(categoriesData);
            await Product.insertMany(productsData);
            const users = await getHashedUsers();
            await User.insertMany(users);
            console.log('✅ MongoDB seeded successfully with sweets, categories and users.');
          }
        }
      }).catch(err => {
        console.warn('MongoDB background connection notice:', err.message);
      });
    } else {
      console.log(`🚀 Sweet Magic High-Performance In-Memory Data Store is Active (41 Sweets, 6 Categories, Cart, Orders, Admin).`);
    }

    return server;
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
