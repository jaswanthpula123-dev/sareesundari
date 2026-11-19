const { categoriesData, productsData, getHashedUsers } = require('../seed/seedData');

// In-Memory store state
const store = {
  users: [],
  categories: [],
  products: [],
  orders: [],
  reviews: [],
  carts: []
};

// Generate realistic mongo-like ObjectId string
const generateId = () => {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  const randomChars = Math.random().toString(16).substring(2, 18).padEnd(16, '0');
  return (timestamp + randomChars).substring(0, 24);
};

// Initialize in-memory store with seeded saree collection
const initStore = async () => {
  if (store.products.length > 0) return;

  const users = await getHashedUsers();
  store.users = users.map(u => ({
    ...u,
    _id: generateId(),
    wishlist: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }));

  store.categories = categoriesData.map(c => ({
    ...c,
    _id: generateId(),
    createdAt: new Date(),
    updatedAt: new Date()
  }));

  store.products = productsData.map(p => {
    const id = generateId();
    return {
      ...p,
      _id: id,
      discountPercentage: p.discountPrice && p.discountPrice < p.price 
        ? Math.round(((p.price - p.discountPrice) / p.price) * 100) 
        : 0,
      finalPrice: p.discountPrice > 0 ? p.discountPrice : p.price,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 100000000)),
      updatedAt: new Date()
    };
  });

  // Seed sample customer reviews for authentic handloom sarees
  if (store.users.length > 1 && store.products.length > 0) {
    const customer = store.users[1];
    const saree1 = store.products[0];
    const saree2 = store.products[1] || store.products[0];
    const saree3 = store.products[2] || store.products[0];

    if (saree1) {
      store.reviews.push({
        _id: generateId(),
        user: customer._id,
        userName: customer.name,
        product: saree1._id,
        rating: 5,
        title: 'Breathtaking Kanjivaram bridal drape & genuine 24K gold zari!',
        comment: 'Ordered for my wedding reception. The korvai border weaving is exquisite, pure mulberry silk feel, and the zari pallu gleams with unmatched royalty!',
        verifiedPurchase: true,
        createdAt: new Date(Date.now() - 86400000 * 4)
      });
    }

    if (saree2) {
      store.reviews.push({
        _id: generateId(),
        user: customer._id,
        userName: 'Pooja Deshmukh',
        product: saree2._id,
        rating: 5,
        title: 'Exquisite Banarasi Tanchoi with Silk Mark guarantee',
        comment: 'The saree arrived in pristine archival box packaging with muslin wrapping. The zari work is feather-light and elegant. Truly master weaver craftsmanship.',
        verifiedPurchase: true,
        createdAt: new Date(Date.now() - 86400000 * 2)
      });
    }

    if (saree3) {
      store.reviews.push({
        _id: generateId(),
        user: customer._id,
        userName: 'Meenakshi Sundaram',
        product: saree3._id,
        rating: 5,
        title: 'Authentic royal Chanderi tissue silk drape',
        comment: 'Draped like a dream for festive celebrations. Soft, breathable, and opulent shine. Saree Sundarii is now my family favorite boutique!',
        verifiedPurchase: true,
        createdAt: new Date(Date.now() - 86400000 * 1)
      });
    }

    // Seed sample initial order for Saree Sundarii admin dashboard
    const p1 = store.products[0];
    const p2 = store.products[1] || store.products[0];
    const initialPrice = p1.discountPrice || p1.price;
    const p2Price = p2.discountPrice || p2.price;
    store.orders.push({
      _id: generateId(),
      orderNumber: 'SS-202611-1001',
      user: customer._id,
      orderItems: [
        {
          product: p1._id,
          name: p1.name,
          image: p1.images[0],
          weight: 'Standard Drape (6.3m)',
          price: initialPrice,
          quantity: 1
        },
        {
          product: p2._id,
          name: p2.name,
          image: p2.images[0],
          weight: 'With Unstitched Blouse',
          price: p2Price,
          quantity: 1
        }
      ],
      shippingAddress: customer.addresses ? customer.addresses[0] : { street: '14 Royal Silk Weaver Street', city: 'Chennai', state: 'Tamil Nadu', zipCode: '600001', country: 'India' },
      paymentMethod: 'Cash',
      paymentResult: {
        id: 'COD_PAY_1001',
        status: 'PENDING',
        updateTime: new Date().toISOString(),
        emailAddress: customer.email
      },
      itemsPrice: initialPrice + p2Price,
      taxPrice: Math.round((initialPrice + p2Price) * 0.05),
      shippingPrice: 0,
      discountAmount: Math.round((initialPrice + p2Price) * 0.20),
      totalPrice: (initialPrice + p2Price) + Math.round((initialPrice + p2Price) * 0.05) - Math.round((initialPrice + p2Price) * 0.20),
      couponApplied: 'SUNDARI20',
      isPaid: false,
      paidAt: null,
      orderStatus: 'Confirmed',
      deliveredAt: null,
      statusHistory: [
        { status: 'Placed', timestamp: new Date(Date.now() - 86400000 * 1), note: 'Order placed for heirloom handcrafted bridal saree' },
        { status: 'Confirmed', timestamp: new Date(), note: 'Inspected with Silk Mark guarantee and packaged in luxury muslin cloth' }
      ],
      createdAt: new Date(Date.now() - 86400000 * 1),
      updatedAt: new Date()
    });
  }

  console.log(`👑 Seeded ${store.products.length} authentic saree varieties, ${store.categories.length} categories, and users into Saree Sundarii.`);
};

module.exports = {
  store,
  initStore,
  generateId
};
