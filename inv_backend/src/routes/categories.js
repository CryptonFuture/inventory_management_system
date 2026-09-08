const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getAllCategories)
  .post(authorize('admin', 'manager'), createCategory);

router.route('/:id')
  .get(getCategory)
  .put(authorize('admin', 'manager'), updateCategory)
  .delete(authorize('admin'), deleteCategory);

module.exports = router;
