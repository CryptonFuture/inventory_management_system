const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('../models/User');
const Category = require('../models/Category');
const Supplier = require('../models/Supplier');
const Product = require('../models/Product');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/inventory_db';

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Supplier.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@inventory.com',
      password: 'admin123',
      role: 'admin'
    });

    const manager = await User.create({
      name: 'Manager User',
      email: 'manager@inventory.com',
      password: 'manager123',
      role: 'manager'
    });

    console.log('Users created');

    // Categories
    const categories = await Category.insertMany([
      { name: 'Electronics', description: 'Electronic devices and accessories' },
      { name: 'Clothing', description: 'Apparel and fashion items' },
      { name: 'Food & Beverages', description: 'Edible products and drinks' },
      { name: 'Office Supplies', description: 'Stationery and office materials' },
      { name: 'Furniture', description: 'Home and office furniture' }
    ]);
    console.log('Categories created');

    // Suppliers
    const suppliers = await Supplier.insertMany([
      {
        name: 'TechWorld Suppliers',
        email: 'contact@techworld.com',
        phone: '+92-300-1234567',
        address: 'Karachi, Pakistan',
        contactPerson: 'Ahmed Khan'
      },
      {
        name: 'Fashion Hub',
        email: 'info@fashionhub.com',
        phone: '+92-321-9876543',
        address: 'Lahore, Pakistan',
        contactPerson: 'Sara Ali'
      },
      {
        name: 'Global Foods Ltd',
        email: 'sales@globalfoods.com',
        phone: '+92-333-5551234',
        address: 'Islamabad, Pakistan',
        contactPerson: 'Bilal Raza'
      }
    ]);
    console.log('Suppliers created');

    // Products
    await Product.insertMany([
      {
        name: 'Wireless Mouse',
        sku: 'ELEC-001',
        description: 'Ergonomic wireless optical mouse',
        category: categories[0]._id,
        supplier: suppliers[0]._id,
        price: 1500,
        costPrice: 900,
        quantity: 45,
        lowStockThreshold: 10,
        unit: 'pcs'
      },
      {
        name: 'USB-C Cable',
        sku: 'ELEC-002',
        description: '1 meter fast charging USB-C cable',
        category: categories[0]._id,
        supplier: suppliers[0]._id,
        price: 450,
        costPrice: 200,
        quantity: 8,
        lowStockThreshold: 15,
        unit: 'pcs'
      },
      {
        name: 'Cotton T-Shirt',
        sku: 'CLO-001',
        description: 'Premium cotton round neck t-shirt',
        category: categories[1]._id,
        supplier: suppliers[1]._id,
        price: 1200,
        costPrice: 600,
        quantity: 120,
        lowStockThreshold: 20,
        unit: 'pcs'
      },
      {
        name: 'Office Chair',
        sku: 'FUR-001',
        description: 'Ergonomic mesh office chair',
        category: categories[4]._id,
        supplier: suppliers[0]._id,
        price: 15000,
        costPrice: 9000,
        quantity: 12,
        lowStockThreshold: 5,
        unit: 'pcs'
      },
      {
        name: 'Notebook A4',
        sku: 'OFF-001',
        description: '200 pages ruled notebook',
        category: categories[3]._id,
        supplier: suppliers[2]._id,
        price: 250,
        costPrice: 120,
        quantity: 5,
        lowStockThreshold: 20,
        unit: 'pcs'
      },
      {
        name: 'Mineral Water 1.5L',
        sku: 'FOOD-001',
        description: 'Pack of 12 bottles',
        category: categories[2]._id,
        supplier: suppliers[2]._id,
        price: 480,
        costPrice: 300,
        quantity: 50,
        lowStockThreshold: 10,
        unit: 'pack'
      }
    ]);
    console.log('Products created');

    console.log('\n✅ Seed completed successfully!');
    console.log('\nLogin credentials:');
    console.log('  Admin  : admin@inventory.com / admin123');
    console.log('  Manager: manager@inventory.com / manager123');
    console.log('\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
