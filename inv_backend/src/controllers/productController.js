const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  try {
    const { search, category, lowStock, page = 1, limit = 20 } = req.query;
    const query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (lowStock === 'true') {
      // Will filter after populate or use aggregation, simple approach:
      // We'll fetch and filter, or use $expr
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    let products = await Product.find(query)
      .populate('category', 'name')
      .populate('supplier', 'name email phone')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    if (lowStock === 'true') {
      products = products.filter((p) => p.quantity <= p.lowStockThreshold);
    }

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      count: products.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name description')
      .populate('supplier', 'name email phone address');

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    const populated = await Product.findById(product._id)
      .populate('category', 'name')
      .populate('supplier', 'name');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: populated
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'SKU already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('category', 'name')
      .populate('supplier', 'name');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateStock = async (req, res) => {
  try {
    const { quantity, operation } = req.body; // operation: 'add' or 'subtract' or 'set'

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (operation === 'add') {
      product.quantity += Number(quantity);
    } else if (operation === 'subtract') {
      product.quantity = Math.max(0, product.quantity - Number(quantity));
    } else {
      product.quantity = Number(quantity);
    }

    await product.save();

    res.json({
      success: true,
      message: 'Stock updated successfully',
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
