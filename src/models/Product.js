// src/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['limpieza', 'mantenimiento', 'quimicos'],
    required: true
  },
  conditions: {
    type: [String],
    default: []  // Condiciones en las que se recomienda este producto
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);



