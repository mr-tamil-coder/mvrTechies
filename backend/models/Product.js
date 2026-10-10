const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    customId: {
      type: String,
      unique: true,
      sparse: true
    },
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true
    },
    category: {
      type: String,
      required: true,
      default: 'Fresh Vegetables'
    },
    unit: {
      type: String,
      default: 'kg'
    },
    price: {
      type: Number,
      required: [true, 'Please provide price per unit'],
      min: [0, 'Price must be positive']
    },
    emoji: {
      type: String,
      default: '🥬'
    },
    image: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    rating: {
      type: Number,
      default: 4.8
    },
    stock: {
      type: Number,
      default: 100
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', productSchema);
