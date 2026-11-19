const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrdersAdmin,
  updateOrderStatus,
  getAllCustomersAdmin,
  updateStock
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect, admin);

router.get('/dashboard', getDashboardStats);
router.get('/customers', getAllCustomersAdmin);

router.route('/products')
  .get(getAllProductsAdmin)
  .post(createProduct);

router.route('/products/:id')
  .put(updateProduct)
  .delete(deleteProduct);

router.put('/products/:id/stock', updateStock);

router.get('/orders', getAllOrdersAdmin);
router.put('/orders/:id/status', updateOrderStatus);

module.exports = router;
