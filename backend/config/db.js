const mongoose = require('mongoose');
const seedInitialData = require('./seed');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/abch_traders', {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    
    // Auto-seed initial data if collections are empty
    await seedInitialData();

    return conn;
  } catch (error) {
    console.warn(`⚠️ MongoDB Connection Notice: ${error.message}`);
    console.warn(`👉 Make sure MongoDB service is running locally on port 27017, or set MONGODB_URI in backend/.env`);
    return null;
  }
};

module.exports = connectDB;
