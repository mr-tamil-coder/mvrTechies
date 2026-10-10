const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  total: { type: Number }
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true
    },
    customerName: {
      type: String,
      required: true
    },
    customerEmail: {
      type: String,
      default: ''
    },
    customerPhone: {
      type: String,
      default: ''
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Delivered', 'Pending', 'Cancelled'],
      default: 'Confirmed'
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

module.exports = mongoose.model('Order', orderSchema);
