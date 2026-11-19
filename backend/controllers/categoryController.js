const Category = require('../models/Category');
const Product = require('../models/Product');
const { store } = require('../config/dataStore');

// @desc    Get all categories with active product count
// @route   GET /api/categories
// @access  Public
const getAllCategories = async (req, res) => {
  try {
    if (global.__IS_MONGO_CONNECTED) {
      const categories = await Category.find({});
      // Update counts dynamically
      const categoriesWithCounts = await Promise.all(
        categories.map(async (cat) => {
          const count = await Product.countDocuments({
            category: { $regex: cat.name, $options: 'i' }
          });
          const catObj = cat.toObject();
          catObj.itemCount = count;
          return catObj;
        })
      );
      return res.json({ success: true, count: categoriesWithCounts.length, categories: categoriesWithCounts });
    } else {
      const categories = store.categories.map(cat => {
        const count = store.products.filter(p =>
          p.category.toLowerCase().includes(cat.name.toLowerCase())
        ).length;
        return {
          ...cat,
          itemCount: count
        };
      });
      return res.json({ success: true, count: categories.length, categories });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get category by slug
// @route   GET /api/categories/:slug
// @access  Public
const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (global.__IS_MONGO_CONNECTED) {
      const category = await Category.findOne({ slug });
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      return res.json({ success: true, category });
    } else {
      const category = store.categories.find(c => c.slug === slug);
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      return res.json({ success: true, category });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllCategories,
  getCategoryBySlug
};
