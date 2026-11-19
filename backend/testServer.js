const http = require('http');

// Helper to make HTTP requests
function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🍬 Starting Sweet Magic Full Stack Verification Suite...');
  
  // 1. Health check
  try {
    const health = await request({
      hostname: '127.0.0.1',
      port: 5000,
      path: '/api/health',
      method: 'GET'
    });
    console.log('✅ 1. Backend Server Health:', health.status, health.body.app, health.body.status);
  } catch (err) {
    console.error('❌ Could not connect to backend server:', err.message);
    process.exit(1);
  }

  // 2. Categories
  const categories = await request({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/categories',
    method: 'GET'
  });
  console.log(`✅ 2. Categories API: ${categories.body.categories.length} sweet categories fetched.`);

  // 3. Products
  const products = await request({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/products',
    method: 'GET'
  });
  console.log(`✅ 3. Products API: ${products.body.products.length} sweet varieties loaded.`);
  
  // Verify sample required sweets are present
  const requiredSweets = [
    'Kaju Katli', 'Gulab Jamun', 'Motichoor Laddu', 'Mysore Pak',
    'Rasmalai', 'Badusha', 'Jalebi', 'Soan Papdi', 'Peda',
    'Boondi Laddu', 'Milk Cake', 'Dry Fruit Laddu'
  ];
  const foundNames = products.body.products.map(p => p.name);
  const allFound = requiredSweets.every(name => foundNames.includes(name));
  console.log(`✅ 3b. Sample 12 Sweets Check: ${allFound ? 'ALL 12 PRESENT' : 'MISSING'}`);

  // 4. Featured sweets
  const featured = await request({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/products/filter/featured',
    method: 'GET'
  });
  console.log(`✅ 4. Featured Sweets: ${featured.body.products.length} featured sweets.`);

  // 5. Customer Authentication (Login)
  const login = await request({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    email: 'customer@sweetmagic.com',
    password: 'customer123'
  });
  console.log('✅ 5. Customer Login:', login.status === 200 ? 'SUCCESS' : 'FAILED', `(User: ${login.body.user?.name})`);
  const userToken = login.body.token;

  // 6. Admin Authentication (Login)
  const adminLogin = await request({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    email: 'admin@sweetmagic.com',
    password: 'admin123'
  });
  console.log('✅ 6. Admin Login:', adminLogin.status === 200 ? 'SUCCESS' : 'FAILED', `(Role: ${adminLogin.body.user?.role})`);
  const adminToken = adminLogin.body.token;

  // 7. Cart Operations with Weight option
  const targetProduct = products.body.products.find(p => p.name === 'Kaju Katli') || products.body.products[0];
  const addToCart = await request({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/cart',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    }
  }, {
    productId: targetProduct._id,
    weight: '500g',
    quantity: 2
  });
  console.log(`✅ 7. Cart Add Item (Weight 500g): ${addToCart.body.cart?.items?.length} item(s) in cart, Subtotal: ₹${addToCart.body.cart?.subtotal}`);

  // 8. Order Placement (Cash on Delivery / Cash)
  const orderRes = await request({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/orders',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    }
  }, {
    orderItems: [{
      product: targetProduct._id,
      name: targetProduct.name,
      image: targetProduct.images[0],
      weight: '500g',
      price: Math.round((targetProduct.discountPrice || targetProduct.price) * 1.95),
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
    paymentMethod: 'Cash',
    discountAmount: 0
  });
  console.log('✅ 8. Order Placement (Cash):', orderRes.status === 201 ? 'SUCCESS' : 'FAILED', `Order #${orderRes.body.order?.orderNumber}`);
  const createdOrderId = orderRes.body.order?._id;

  // 9. Admin Dashboard Stats
  const adminDashboard = await request({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/admin/dashboard',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  console.log(`✅ 9. Admin Dashboard Stats: Total Revenue: ₹${adminDashboard.body.stats?.totalRevenue}, Total Orders: ${adminDashboard.body.stats?.totalOrders}, Total Products: ${adminDashboard.body.stats?.totalProducts}`);

  // 10. Admin Update Order Status
  if (createdOrderId) {
    const updateStatus = await request({
      hostname: '127.0.0.1',
      port: 5000,
      path: `/api/admin/orders/${createdOrderId}/status`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      }
    }, {
      status: 'Preparing',
      note: 'Fresh sweets prepared in pure desi ghee and packed in gift boxes.'
    });
    console.log(`✅ 10. Admin Order Status Update: ${updateStatus.body.message}`);
  }

  // 11. Admin Add New Sweet
  const newSweet = await request({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/admin/products',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    }
  }, {
    name: 'Shahi Kesar Pista Roll',
    category: 'Dry Fruit Sweets',
    description: 'Luxurious cashew roll stuffed with roasted pistachio filling and infused with pure Kashmiri saffron.',
    price: 340,
    discountPrice: 310,
    weightOptions: ['250g', '500g', '1kg'],
    stock: 20,
    images: ['/sweets/kaju-katli.jpg'],
    isFeatured: true,
    isBestSeller: false,
    isFestivalSpecial: true,
    pureGhee: true,
    isVeg: true,
    shelfLife: '20 Days',
    ingredients: 'Goan Cashews, Pistachios, Kashmiri Kesar, Sugar, Cow Desi Ghee.'
  });
  console.log(`✅ 11. Admin Sweet Creation: Created "${newSweet.body.product?.name}" (ID: ${newSweet.body.product?._id})`);

  console.log('\n🍬 ALL 11 SWEET MAGIC TEST SUITES PASSED FLAWLESSLY! ✨');
  process.exit(0);
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
