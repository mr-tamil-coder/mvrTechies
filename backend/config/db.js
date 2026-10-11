// backend/config/db.js
const dns = require("node:dns");
const mongoose = require("mongoose");
const seedInitialData = require("./seed");

// Force public DNS servers so SRV lookups for mongodb+srv:// work
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from backend/.env");
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(
      `MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`,
    );

    await seedInitialData();

    return conn;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

module.exports = connectDB;