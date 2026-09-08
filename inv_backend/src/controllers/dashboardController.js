const Product = require('../models/Product');
const Category = require('../models/Category');
const Supplier = require('../models/Supplier');
const User = require('../models/User');

exports.getStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalCategories = await Category.countDocuments({ isActive: true });
    const totalSuppliers = await Supplier.countDocuments({ isActive: true });
    const totalUsers = await User.countDocuments({ isActive: true });

    // Low stock products
    const allProducts = await Product.find({ isActive: true }).select(
      'name sku quantity lowStockThreshold price'
    );
    const lowStockProducts = allProducts.filter(
      (p) => p.quantity <= p.lowStockThreshold
    );

    // Inventory value
    const inventoryValue = allProducts.reduce(
      (sum, p) => sum + p.quantity * (p.price || 0),
      0
    );

    // Total stock quantity
    const totalStock = allProducts.reduce((sum, p) => sum + p.quantity, 0);

    // Recent products
    const recentProducts = await Product.find({ isActive: true })
      .populate('category', 'name')
      .sort('-createdAt')
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalProducts,
        totalCategories,
        totalSuppliers,
        totalUsers,
        lowStockCount: lowStockProducts.length,
        inventoryValue: Math.round(inventoryValue * 100) / 100,
        totalStock,
        lowStockProducts: lowStockProducts.slice(0, 10),
        recentProducts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
