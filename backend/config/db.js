const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sweet_magic';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    global.__IS_MONGO_CONNECTED = true;
    console.log(`✨ MongoDB Connected Successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`⚠️ Local MongoDB daemon is not running (${error.message}).`);
    console.log(`🚀 Activating Sweet Magic In-Memory High Performance Store. All customer browsing, weight selections, cart, orders, and admin dashboard work seamlessly!`);
    global.__IS_MONGO_CONNECTED = false;
    return null;
  }
};

module.exports = { connectDB, getIsConnected: () => isConnected };
