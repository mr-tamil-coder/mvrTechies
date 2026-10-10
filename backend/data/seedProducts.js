/**
 * ABCH Traders — Product Catalog Seeder
 * 
 * Seeds only the product catalog into MongoDB.
 * Users, inquiries, invoices, orders come from real usage — NOT seeded here.
 * 
 * Run: node data/seedProducts.js
 */

require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Product = require('../models/Product');
const { seedProducts } = require('./seedData');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/abch_traders';

const run = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected:', MONGODB_URI);

    const existing = await Product.countDocuments();
    if (existing > 0) {
      console.log(`ℹ️  ${existing} products already exist in DB. Skipping seed.`);
      console.log('   To reseed, manually drop the "products" collection first.');
    } else {
      const docs = seedProducts.map(p => ({
        customId: p.customId,
        name: p.name,
        category: p.category,
        unit: p.unit,
        price: p.price,
        emoji: p.emoji,
        image: p.image,
        description: p.description,
        rating: p.rating,
        stock: p.stock
      }));

      await Product.insertMany(docs);
      console.log(`✅ Seeded ${docs.length} products into MongoDB.`);
    }
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connection closed.');
    process.exit(0);
  }
};

run();
