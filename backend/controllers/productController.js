const Product = require('../models/Product');
const { seedProducts } = require('../data/seedData');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    let products = await Product.find({ isActive: true });

    // Auto-seed if empty
    if (products.length === 0) {
      await Product.insertMany(seedProducts);
      products = await Product.find({ isActive: true });
    }

    res.json({
      success: true,
      count: products.length,
      products: products.map(p => ({
        id: p.customId || p._id.toString(),
        mongoId: p._id,
        name: p.name,
        category: p.category,
        unit: p.unit,
        price: p.price,
        emoji: p.emoji,
        image: p.image,
        description: p.description,
        rating: p.rating,
        stock: p.stock
      }))
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product price
// @route   PUT /api/products/:id/price
// @access  Public (or Admin protected in prod)
const updateProductPrice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { price } = req.body;

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ success: false, message: 'Invalid price value' });
    }

    // Find by customId or MongoDB _id
    let product = await Product.findOne({
      $or: [
        { customId: id },
        ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : [])
      ]
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.price = numericPrice;
    await product.save();

    res.json({
      success: true,
      message: 'Product price updated successfully in MongoDB',
      product: {
        id: product.customId || product._id.toString(),
        name: product.name,
        price: product.price
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Public (or Admin protected)
const createProduct = async (req, res, next) => {
  try {
    const { name, category, unit, price, emoji, image, description, rating, stock } = req.body;

    if (!name || price === undefined || price === null || price === '') {
      return res.status(400).json({ success: false, message: 'Please provide product name and price' });
    }

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ success: false, message: 'Invalid price value' });
    }

    // Generate customId from name
    const customId = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `prod-${Date.now()}`;

    const newProduct = await Product.create({
      customId,
      name: name.trim(),
      category: category || 'Fresh Produce',
      unit: unit || 'kg',
      price: numericPrice,
      emoji: emoji || '🥬',
      image: image || '',
      description: description || '',
      rating: parseFloat(rating) || 4.8,
      stock: parseInt(stock, 10) || 100,
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: {
        id: newProduct.customId || newProduct._id.toString(),
        mongoId: newProduct._id,
        name: newProduct.name,
        category: newProduct.category,
        unit: newProduct.unit,
        price: newProduct.price,
        emoji: newProduct.emoji,
        image: newProduct.image,
        description: newProduct.description,
        rating: newProduct.rating,
        stock: newProduct.stock
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update entire product details (name, category, unit, price, description, etc.)
// @route   PUT /api/products/:id
// @access  Public (or Admin protected)
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, category, unit, price, emoji, image, description, rating, stock, isActive } = req.body;

    let product = await Product.findOne({
      $or: [
        { customId: id },
        ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : [])
      ]
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (name !== undefined) product.name = name.trim();
    if (category !== undefined) product.category = category;
    if (unit !== undefined) product.unit = unit;
    if (price !== undefined) {
      const numPrice = parseFloat(price);
      if (!isNaN(numPrice) && numPrice >= 0) product.price = numPrice;
    }
    if (emoji !== undefined) product.emoji = emoji;
    if (image !== undefined) product.image = image;
    if (description !== undefined) product.description = description;
    if (rating !== undefined) product.rating = parseFloat(rating) || product.rating;
    if (stock !== undefined) product.stock = parseInt(stock, 10) || product.stock;
    if (isActive !== undefined) product.isActive = Boolean(isActive);

    await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: {
        id: product.customId || product._id.toString(),
        mongoId: product._id,
        name: product.name,
        category: product.category,
        unit: product.unit,
        price: product.price,
        emoji: product.emoji,
        image: product.image,
        description: product.description,
        rating: product.rating,
        stock: product.stock
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete (or soft delete) product
// @route   DELETE /api/products/:id
// @access  Public (or Admin protected)
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findOneAndDelete({
      $or: [
        { customId: id },
        ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : [])
      ]
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      message: 'Product removed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Seed or reset product database
// @route   POST /api/products/seed
// @access  Public
const seedDatabase = async (req, res, next) => {
  try {
    await Product.deleteMany({});
    const inserted = await Product.insertMany(seedProducts);
    res.json({
      success: true,
      message: `Seeded ${inserted.length} farm-fresh products successfully into MongoDB`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  updateProductPrice,
  deleteProduct,
  seedDatabase
};
