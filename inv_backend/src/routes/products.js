const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getAllProducts)
  .post(authorize('admin', 'manager'), createProduct);

router.route('/:id')
  .get(getProduct)
  .put(authorize('admin', 'manager'), updateProduct)
  .delete(authorize('admin'), deleteProduct);

router.patch('/:id/stock', authorize('admin', 'manager', 'staff'), updateStock);

module.exports = router;
