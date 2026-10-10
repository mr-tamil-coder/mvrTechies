const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0.1 },
  price: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 }
});

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    date: {
      type: String,
      required: true,
      default: () => new Date().toISOString().split('T')[0]
    },
    customerName: {
      type: String,
      required: [true, 'Please provide customer name'],
      trim: true
    },
    customerPhone: {
      type: String,
      default: ''
    },
    customerEmail: {
      type: String,
      default: ''
    },
    customerAddress: {
      type: String,
      default: ''
    },
    items: [invoiceItemSchema],
    subtotal: {
      type: Number,
      required: true,
      default: 0
    },
    taxRate: {
      type: Number,
      default: 5
    },
    taxAmount: {
      type: Number,
      default: 0
    },
    shipping: {
      type: Number,
      default: 0
    },
    grandTotal: {
      type: Number,
      required: true,
      default: 0
    },
    status: {
      type: String,
      enum: ['Paid', 'Pending', 'Cancelled'],
      default: 'Paid'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Invoice', invoiceSchema);
