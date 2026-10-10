/**
 * ABCH Traders - Admin Seeder Script
 * 
 * Run this once to create the admin account in MongoDB:
 *   node data/seedAdmin.js
 * 
 * Admin Credentials:
 *   Email:    admin@abchtraders.com
 *   Password: adminPass123
 */

require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/abch_traders';

const seedAdmin = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB:', MONGODB_URI);

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@abchtraders.com' });

    if (existingAdmin) {
      // Update role to admin just in case
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log('ℹ️  Admin account already exists. Role confirmed as admin.');
      console.log('   Email:    admin@abchtraders.com');
      console.log('   Password: adminPass123 (use original password you set)');
    } else {
      // Create fresh admin
      const admin = await User.create({
        name: 'ABCH Administrator',
        email: 'admin@abchtraders.com',
        phone: '+91 98401 00001',
        password: 'adminPass123',       // Will be hashed by pre-save hook
        businessName: 'ABCH Traders Pvt Ltd',
        location: 'Koyambedu, Chennai',
        role: 'admin',
        status: 'Active'
      });

      console.log('✅ Admin account created successfully!');
      console.log('   Name:     ', admin.name);
      console.log('   Email:    ', admin.email);
      console.log('   Password: adminPass123');
      console.log('   Role:     ', admin.role);
    }

    console.log('\n🔑 Login at: http://localhost:5173/admin/login');
    console.log('   Email:    admin@abchtraders.com');
    console.log('   Password: adminPass123\n');

  } catch (error) {
    console.error('❌ Seeder error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed.');
    process.exit(0);
  }
};

seedAdmin();
