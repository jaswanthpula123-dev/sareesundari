const Product = require('../models/Product');
const Review = require('../models/Review');
const { store, generateId } = require('../config/dataStore');

// @desc    Get all sweets with search, filter, sort & pagination
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, inStockOnly, isFeatured, isBestSeller, isFestivalSpecial, pureGhee, sort, limit = 50 } = req.query;

    if (global.__IS_MONGO_CONNECTED) {
      let query = {};

      if (keyword) {
        query.$or = [
          { name: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
          { category: { $regex: keyword, $options: 'i' } },
          { ingredients: { $regex: keyword, $options: 'i' } }
        ];
      }

      if (category && category !== 'All') {
        query.category = { $regex: category, $options: 'i' };
      }

      if (inStockOnly === 'true' || inStockOnly === true) {
        query.stock = { $gt: 0 };
        query.availability = { $ne: 'Out of Stock' };
      }

      if (isFeatured === 'true' || isFeatured === true) {
        query.isFeatured = true;
      }

      if (isBestSeller === 'true' || isBestSeller === true) {
        query.isBestSeller = true;
      }

      if (isFestivalSpecial === 'true' || isFestivalSpecial === true) {
        query.isFestivalSpecial = true;
      }

      if (pureGhee === 'true' || pureGhee === true) {
        query.pureGhee = true;
      }

      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      let sortOption = { createdAt: -1 };
      if (sort === 'price-asc') sortOption = { price: 1 };
      else if (sort === 'price-desc') sortOption = { price: -1 };
      else if (sort === 'rating') sortOption = { rating: -1 };
      else if (sort === 'popular') sortOption = { numReviews: -1 };

      const products = await Product.find(query).sort(sortOption).limit(Number(limit));
      const total = await Product.countDocuments(query);

      return res.json({
        success: true,
        count: products.length,
        total,
        products
      });
    } else {
      let result = [...store.products];

      if (keyword) {
        const kw = keyword.toLowerCase();
        result = result.filter(p =>
          p.name.toLowerCase().includes(kw) ||
          p.description.toLowerCase().includes(kw) ||
          p.category.toLowerCase().includes(kw) ||
          (p.ingredients && p.ingredients.toLowerCase().includes(kw))
        );
      }

      if (category && category !== 'All') {
        const cat = category.toLowerCase().replace(/-/g, ' ');
        result = result.filter(p => 
          p.category.toLowerCase().includes(cat) || 
          p.category.toLowerCase().replace(/-/g, ' ').includes(cat)
        );
      }

      if (inStockOnly === 'true' || inStockOnly === true) {
        result = result.filter(p => p.stock > 0 && p.availability !== 'Out of Stock');
      }

      if (isFeatured === 'true' || isFeatured === true) {
        result = result.filter(p => p.isFeatured);
      }

      if (isBestSeller === 'true' || isBestSeller === true) {
        result = result.filter(p => p.isBestSeller);
      }

      if (isFestivalSpecial === 'true' || isFestivalSpecial === true) {
        result = result.filter(p => p.isFestivalSpecial);
      }

      if (pureGhee === 'true' || pureGhee === true) {
        result = result.filter(p => p.pureGhee);
      }

      if (minPrice) {
        result = result.filter(p => (p.discountPrice || p.price) >= Number(minPrice));
      }

      if (maxPrice) {
        result = result.filter(p => (p.discountPrice || p.price) <= Number(maxPrice));
      }

      if (sort === 'price-asc') {
        result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
      } else if (sort === 'price-desc') {
        result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
      } else if (sort === 'rating') {
        result.sort((a, b) => b.rating - a.rating);
      } else if (sort === 'popular') {
        result.sort((a, b) => b.numReviews - a.numReviews);
      } else {
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      const total = result.length;
      result = result.slice(0, Number(limit));

      return res.json({
        success: true,
        count: result.length,
        total,
        products: result
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single sweet by slug or ID
// @route   GET /api/products/:slugOrId
// @access  Public
const getProductBySlugOrId = async (req, res) => {
  try {
    const { slugOrId } = req.params;

    if (global.__IS_MONGO_CONNECTED) {
      let product;
      if (slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
        product = await Product.findById(slugOrId);
      }
      if (!product) {
        product = await Product.findOne({ slug: slugOrId });
      }

      if (!product) {
        return res.status(404).json({ success: false, message: 'Sweet not found in catalog' });
      }

      const reviews = await Review.find({ product: product._id }).sort({ createdAt: -1 });

      const related = await Product.find({
        category: product.category,
        _id: { $ne: product._id }
      }).limit(4);

      return res.json({
        success: true,
        product,
        reviews,
        related
      });
    } else {
      const product = store.products.find(p => p._id.toString() === slugOrId || p.slug === slugOrId);

      if (!product) {
        return res.status(404).json({ success: false, message: 'Sweet not found in catalog' });
      }

      const reviews = store.reviews.filter(r => r.product.toString() === product._id.toString());
      const related = store.products
        .filter(p => p.category === product.category && p._id.toString() !== product._id.toString())
        .slice(0, 4);

      return res.json({
        success: true,
        product,
        reviews,
        related
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add review to sweet
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
  try {
    const { rating, title, comment } = req.body;
    const productId = req.params.id;

    if (global.__IS_MONGO_CONNECTED) {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Sweet not found' });
      }

      const alreadyReviewed = await Review.findOne({
        product: productId,
        user: req.user._id
      });

      if (alreadyReviewed) {
        return res.status(400).json({ success: false, message: 'You have already reviewed this sweet' });
      }

      const review = await Review.create({
        user: req.user._id,
        userName: req.user.name,
        product: productId,
        rating: Number(rating),
        title,
        comment,
        verifiedPurchase: true
      });

      // Recalculate average rating
      const reviews = await Review.find({ product: productId });
      product.numReviews = reviews.length;
      product.rating = Number((reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length).toFixed(1));
      await product.save();

      return res.status(201).json({
        success: true,
        message: 'Review submitted successfully',
        review
      });
    } else {
      const product = store.products.find(p => p._id.toString() === productId);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Sweet not found' });
      }

      const alreadyReviewed = store.reviews.find(
        r => r.product.toString() === productId && r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ success: false, message: 'You have already reviewed this sweet' });
      }

      const newReview = {
        _id: generateId(),
        user: req.user._id,
        userName: req.user.name,
        product: productId,
        rating: Number(rating),
        title,
        comment,
        verifiedPurchase: true,
        createdAt: new Date()
      };

      store.reviews.push(newReview);

      const prodReviews = store.reviews.filter(r => r.product.toString() === productId);
      product.numReviews = prodReviews.length;
      product.rating = Number((prodReviews.reduce((acc, item) => item.rating + acc, 0) / prodReviews.length).toFixed(1));

      return res.status(201).json({
        success: true,
        message: 'Review submitted successfully',
        review: newReview
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get featured sweets
// @route   GET /api/products/filter/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    if (global.__IS_MONGO_CONNECTED) {
      const products = await Product.find({ isFeatured: true }).limit(8);
      return res.json({ success: true, count: products.length, products });
    } else {
      const products = store.products.filter(p => p.isFeatured).slice(0, 8);
      return res.json({ success: true, count: products.length, products });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get best seller sweets
// @route   GET /api/products/filter/bestsellers
// @access  Public
const getBestSellers = async (req, res) => {
  try {
    if (global.__IS_MONGO_CONNECTED) {
      const products = await Product.find({ isBestSeller: true }).limit(8);
      return res.json({ success: true, count: products.length, products });
    } else {
      const products = store.products.filter(p => p.isBestSeller).slice(0, 8);
      return res.json({ success: true, count: products.length, products });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get festival special sweets
// @route   GET /api/products/filter/festivalspecial
// @access  Public
const getFestivalSpecials = async (req, res) => {
  try {
    if (global.__IS_MONGO_CONNECTED) {
      const products = await Product.find({ isFestivalSpecial: true }).limit(8);
      return res.json({ success: true, count: products.length, products });
    } else {
      const products = store.products.filter(p => p.isFestivalSpecial).slice(0, 8);
      return res.json({ success: true, count: products.length, products });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductBySlugOrId,
  createProductReview,
  getFeaturedProducts,
  getBestSellers,
  getFestivalSpecials
};
