const User = require('../models/User');
const Product = require('../models/Product');
const Inquiry = require('../models/Inquiry');
const Invoice = require('../models/Invoice');
const { seedProducts, seedUsers, seedInquiries, seedInvoices } = require('../data/seedData');

const seedInitialData = async () => {
  try {
    // 1. Seed Admin & Initial Users
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      for (const u of seedUsers) {
        await User.create(u);
      }
      console.log('✅ Seeded initial users (including Admin: admin@abchtraders.com / adminPass123)');
    } else {
      // Ensure admin exists
      const adminExists = await User.findOne({ email: 'admin@abchtraders.com' });
      if (!adminExists) {
        await User.create({
          name: 'Administrator',
          phone: '+91 98401 00000',
          email: 'admin@abchtraders.com',
          password: 'adminPass123',
          businessName: 'ABCH Traders HQ',
          location: 'Chennai Central, TN',
          role: 'admin'
        });
        console.log('✅ Created default admin account (admin@abchtraders.com / adminPass123)');
      }
    }

    // 2. Seed Products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany(seedProducts);
      console.log(`✅ Seeded ${seedProducts.length} farm-fresh products into MongoDB`);
    }

    // 3. Seed Inquiries
    const inquiryCount = await Inquiry.countDocuments();
    if (inquiryCount === 0) {
      await Inquiry.insertMany(seedInquiries);
      console.log('✅ Seeded initial contact inquiries');
    }

    // 4. Seed Invoices
    const invoiceCount = await Invoice.countDocuments();
    if (invoiceCount === 0) {
      await Invoice.insertMany(seedInvoices);
      console.log('✅ Seeded initial invoices');
    }
  } catch (err) {
    console.error('Error during database seeding:', err.message);
  }
};

module.exports = seedInitialData;
