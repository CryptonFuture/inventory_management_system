const express = require('express');
const router = express.Router();
const {
  getAllSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier
} = require('../controllers/supplierController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getAllSuppliers)
  .post(authorize('admin', 'manager'), createSupplier);

router.route('/:id')
  .get(getSupplier)
  .put(authorize('admin', 'manager'), updateSupplier)
  .delete(authorize('admin'), deleteSupplier);

module.exports = router;
