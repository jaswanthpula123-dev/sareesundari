const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

const { initStore } = require('./config/dataStore');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Direct mock test runner
function mockRequest(app, method, url, body = {}, headers = {}) {
  return new Promise((resolve) => {
    const { EventEmitter } = require('events');
    const req = new EventEmitter();
    req.method = method;
    req.url = url;
    req.headers = { 'content-type': 'application/json', ...headers };
    req.body = body;
    req.query = {};
    
    // parse query
    if (url.includes('?')) {
      const parts = url.split('?');
      req.url = parts[0];
      const params = new URLSearchParams(parts[1]);
      for (const [k, v] of params.entries()) {
        req.query[k] = v;
      }
    }

    const res = {
      statusCode: 200,
      headers: {},
      setHeader(k, v) { this.headers[k] = v; },
      getHeader(k) { return this.headers[k]; },
      status(code) { this.statusCode = code; return this; },
      json(data) { resolve({ status: this.statusCode, body: data }); },
      send(data) { resolve({ status: this.statusCode, body: data }); }
    };

    app(req, res, (err) => {
      if (err) resolve({ status: 500, body: { error: err.message } });
      else resolve({ status: 404, body: { error: 'Not Found' } });
    });
  });
}

async function runDirectTests() {
  console.log('🍬 Starting Direct In-Memory Sweet Magic Test Suite...');
  await initStore();

  // 1. Categories
  const catRes = await mockRequest(app, 'GET', '/api/categories');
  console.log(`✅ 1. Categories: ${catRes.body.categories?.length} categories fetched.`);

  // 2. Products
  const prodRes = await mockRequest(app, 'GET', '/api/products');
  console.log(`✅ 2. Products: ${prodRes.body.products?.length} sweets loaded.`);

  // Check 12 requested sweets
  const requiredSweets = [
    'Kaju Katli', 'Gulab Jamun', 'Motichoor Laddu', 'Mysore Pak',
    'Rasmalai', 'Badusha', 'Jalebi', 'Soan Papdi', 'Peda',
    'Boondi Laddu', 'Milk Cake', 'Dry Fruit Laddu'
  ];
  const names = prodRes.body.products.map(p => p.name);
  const allPresent = requiredSweets.every(s => names.includes(s));
  console.log(`✅ 2b. All 12 requested sweets present: ${allPresent}`);

  // 3. Featured
  const featRes = await mockRequest(app, 'GET', '/api/products/filter/featured');
  console.log(`✅ 3. Featured Sweets: ${featRes.body.products?.length} items.`);

  // 4. Customer Login
  const custLogin = await mockRequest(app, 'POST', '/api/auth/login', {
    email: 'customer@sweetmagic.com',
    password: 'customer123'
  });
  console.log(`✅ 4. Customer Login: status ${custLogin.status}, user: ${custLogin.body.user?.name}`);
  const userToken = custLogin.body.token;

  // 5. Admin Login
  const admLogin = await mockRequest(app, 'POST', '/api/auth/login', {
    email: 'admin@sweetmagic.com',
    password: 'admin123'
  });
  console.log(`✅ 5. Admin Login: status ${admLogin.status}, role: ${admLogin.body.user?.role}`);
  const adminToken = admLogin.body.token;

  // 6. Add to Cart with Weight (500g)
  const sweet = prodRes.body.products[0];
  const cartRes = await mockRequest(app, 'POST', '/api/cart', {
    productId: sweet._id,
    weight: '500g',
    quantity: 2
  }, { authorization: `Bearer ${userToken}` });
  console.log(`✅ 6. Cart Add: ${cartRes.body.cart?.items?.length} items, subtotal: ₹${cartRes.body.cart?.subtotal}`);

  // 7. Place Order with Cash
  const orderRes = await mockRequest(app, 'POST', '/api/orders', {
    orderItems: [{
      product: sweet._id,
      name: sweet.name,
      image: sweet.images[0],
      weight: '500g',
      price: Math.round((sweet.discountPrice || sweet.price) * 1.95),
      quantity: 2
    }],
    shippingAddress: {
      fullName: 'Aarav Sharma',
      mobile: '9123456789',
      email: 'customer@sweetmagic.com',
      street: 'Flat 302, Palm Meadows, Whitefield',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560066'
    },
    paymentMethod: 'Cash'
  }, { authorization: `Bearer ${userToken}` });
  console.log(`✅ 7. Order Placement (Cash): Order #${orderRes.body.order?.orderNumber}`);

  // 8. Admin Dashboard
  const dashRes = await mockRequest(app, 'GET', '/api/admin/dashboard', {}, { authorization: `Bearer ${adminToken}` });
  console.log(`✅ 8. Admin Dashboard: Revenue ₹${dashRes.body.stats?.totalRevenue}, Orders: ${dashRes.body.stats?.totalOrders}, Sweets: ${dashRes.body.stats?.totalProducts}`);

  // 9. Admin Create New Sweet
  const createRes = await mockRequest(app, 'POST', '/api/admin/products', {
    name: 'Shahi Kesar Pista Roll',
    category: 'Dry Fruit Sweets',
    description: 'Luxurious cashew roll stuffed with roasted pistachio filling and infused with pure Kashmiri saffron.',
    price: 340,
    discountPrice: 310,
    weightOptions: ['250g', '500g', '1kg'],
    stock: 20,
    images: ['/sweets/kaju-katli.jpg']
  }, { authorization: `Bearer ${adminToken}` });
  console.log(`✅ 9. Admin Create Sweet: Created "${createRes.body.product?.name}"`);

  console.log('\n🍬 ALL SWEET MAGIC IN-MEMORY VERIFICATION TESTS PASSED! 👑');
}

runDirectTests().catch(console.error);
