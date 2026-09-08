const Supplier = require('../models/Supplier');
const Product = require('../models/Product');

exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find({ isActive: true }).sort('name');
    res.json({
      success: true,
      count: suppliers.length,
      suppliers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier || !supplier.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }
    res.json({ success: true, supplier });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.createSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Supplier created successfully',
      supplier
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }
    res.json({
      success: true,
      message: 'Supplier updated successfully',
      supplier
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteSupplier = async (req, res) => {
  try {
    const productsCount = await Product.countDocuments({
      supplier: req.params.id,
      isActive: true
    });
    if (productsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete. ${productsCount} product(s) are linked to this supplier.`
      });
    }

    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }
    res.json({
      success: true,
      message: 'Supplier deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
