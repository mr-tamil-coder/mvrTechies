const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide full name'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Please provide phone number'],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      default: ''
    },
    businessName: {
      type: String,
      default: ''
    },
    businessType: {
      type: String,
      default: 'General Wholesale'
    },
    message: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['New', 'In Review', 'Responded'],
      default: 'New'
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split('T')[0]
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Inquiry', inquirySchema);
