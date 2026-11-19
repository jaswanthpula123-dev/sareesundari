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

// Initialize in-memory store with seeded sweets data
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

  // Seed sample customer reviews for authentic sweets
  if (store.users.length > 1 && store.products.length > 0) {
    const customer = store.users[1];
    const kajuKatli = store.products.find(p => p.slug === 'kaju-katli') || store.products[0];
    const motichoor = store.products.find(p => p.slug === 'motichoor-laddu') || store.products[1];
    const mysorePak = store.products.find(p => p.slug === 'mysore-pak') || store.products[2];

    if (kajuKatli) {
      store.reviews.push({
        _id: generateId(),
        user: customer._id,
        userName: customer.name,
        product: kajuKatli._id,
        rating: 5,
        title: 'Breathtaking pure Goan cashew melt & genuine silver vark!',
        comment: 'Ordered Kaju Katli for Diwali puja. The diamond pieces are paper-thin, soft, not overly sweet, and melt right on the tongue. Truly royal quality!',
        verifiedPurchase: true,
        createdAt: new Date(Date.now() - 86400000 * 4)
      });
    }

    if (motichoor) {
      store.reviews.push({
        _id: generateId(),
        user: customer._id,
        userName: 'Pooja Deshmukh',
        product: motichoor._id,
        rating: 5,
        title: 'Exquisite Desi Ghee pearls with saffron and pistachios',
        comment: 'The laddus arrived in pristine airtight box packaging. You can smell the fragrant cow ghee as soon as you open it. Authentic Halwai mastery.',
        verifiedPurchase: true,
        createdAt: new Date(Date.now() - 86400000 * 2)
      });
    }

    if (mysorePak) {
      store.reviews.push({
        _id: generateId(),
        user: customer._id,
        userName: 'Suresh Rao',
        product: mysorePak._id,
        rating: 5,
        title: 'Authentic royal Mysore porous texture and aroma',
        comment: 'The honeycomb pores soaked in desi ghee take me straight back to childhood memories in Karnataka. Melt-in-the-mouth perfection!',
        verifiedPurchase: true,
        createdAt: new Date(Date.now() - 86400000 * 1)
      });
    }

    const kajuPistaRoll = store.products.find(p => p.slug === 'royal-kaju-pista-roll');
    if (kajuPistaRoll) {
      store.reviews.push({
        _id: generateId(),
        user: customer._id,
        userName: 'Vikramaditya Verma',
        product: kajuPistaRoll._id,
        rating: 5,
        title: 'Heavenly cashew exterior and rich pistachio core!',
        comment: 'The presentation with edible silver vark is stunning. The pistachio flavor inside is vibrant and nutty. Perfect gift for VIP corporate clients.',
        verifiedPurchase: true,
        createdAt: new Date(Date.now() - 86400000 * 3)
      });
    }

    const anjeerBarfi = store.products.find(p => p.slug === 'sugar-free-anjeer-dry-fruit-barfi');
    if (anjeerBarfi) {
      store.reviews.push({
        _id: generateId(),
        user: customer._id,
        userName: 'Meenakshi Sundaram',
        product: anjeerBarfi._id,
        rating: 5,
        title: 'Guilt-free delight! Naturally sweet & super crunchy',
        comment: 'My parents have sugar restrictions and this was a blessing! Zero refined sugar, loaded with crunchy almonds and figs. Will be ordering regularly.',
        verifiedPurchase: true,
        createdAt: new Date(Date.now() - 86400000 * 2)
      });
    }

    const rosogolla = store.products.find(p => p.slug === 'kolkata-spongy-rosogolla');
    if (rosogolla) {
      store.reviews.push({
        _id: generateId(),
        user: customer._id,
        userName: 'Debojyoti Sen',
        product: rosogolla._id,
        rating: 5,
        title: 'Cloud-like sponginess! Truly authentic Kolkata taste',
        comment: 'As a Bengali living in Bangalore, finding authentic spongy rosogolla is rare. Sweet Magic nails it—pure chhena, light syrup, and heavenly cardamom aroma!',
        verifiedPurchase: true,
        createdAt: new Date(Date.now() - 86400000 * 2)
      });
    }

    const mishtiDoi = store.products.find(p => p.slug === 'traditional-matka-mishti-doi');
    if (mishtiDoi) {
      store.reviews.push({
        _id: generateId(),
        user: customer._id,
        userName: 'Rituparna Chatterjee',
        product: mishtiDoi._id,
        rating: 5,
        title: 'Thick, creamy and served in a real earthen pot',
        comment: 'The caramelized flavor with subtle earthen claypot essence is perfection. Not overly sweet, perfectly thick. 10/10 recommendation!',
        verifiedPurchase: true,
        createdAt: new Date(Date.now() - 86400000 * 1)
      });
    }

    const tirupatiLaddu = store.products.find(p => p.slug === 'sacred-tirupati-prasadam-laddu');
    if (tirupatiLaddu) {
      store.reviews.push({
        _id: generateId(),
        user: customer._id,
        userName: 'Venkata Ramanujam',
        product: tirupatiLaddu._id,
        rating: 5,
        title: 'Divinely authentic! Sacred camphor and rich cow ghee aroma',
        comment: 'The taste is indistinguishable from the holy prasadam at the hill temple. Pure ghee, whole cashews, crunchy rock sugar. Brings back immense devotion.',
        verifiedPurchase: true,
        createdAt: new Date(Date.now() - 86400000 * 2)
      });
    }

    // Seed sample initial order for Sweet Magic admin dashboard
    const p1 = store.products[0];
    const p2 = store.products[1];
    const initialPrice = p1.discountPrice || p1.price;
    const p2Price = p2.discountPrice || p2.price;
    store.orders.push({
      _id: generateId(),
      orderNumber: 'SM-202611-1001',
      user: customer._id,
      orderItems: [
        {
          product: p1._id,
          name: p1.name,
          image: p1.images[0],
          weight: '500g',
          price: initialPrice,
          quantity: 2
        },
        {
          product: p2._id,
          name: p2.name,
          image: p2.images[0],
          weight: '1kg',
          price: p2Price,
          quantity: 1
        }
      ],
      shippingAddress: customer.addresses ? customer.addresses[0] : { street: '42 Sweet Confectionery Lane', city: 'Chennai', state: 'Tamil Nadu', zipCode: '600001', country: 'India' },
      paymentMethod: 'Cash',
      paymentResult: {
        id: 'COD_PAY_1001',
        status: 'PENDING',
        updateTime: new Date().toISOString(),
        emailAddress: customer.email
      },
      itemsPrice: (initialPrice * 2) + p2Price,
      taxPrice: Math.round(((initialPrice * 2) + p2Price) * 0.05),
      shippingPrice: 0,
      discountAmount: 100,
      totalPrice: ((initialPrice * 2) + p2Price) + Math.round(((initialPrice * 2) + p2Price) * 0.05) - 100,
      couponApplied: 'SWEET10',
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
