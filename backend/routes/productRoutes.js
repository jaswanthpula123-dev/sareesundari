const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductBySlugOrId,
  getFeaturedProducts,
  getBestSellers,
  getFestivalSpecials,
  createProductReview
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getAllProducts);
router.get('/filter/featured', getFeaturedProducts);
router.get('/filter/bestsellers', getBestSellers);
router.get('/filter/festivalspecial', getFestivalSpecials);
router.get('/filter/new-arrivals', getBestSellers); // Fallback alias

router.route('/:id/reviews')
  .post(protect, createProductReview);

router.get('/:slugOrId', getProductBySlugOrId);

module.exports = router;
