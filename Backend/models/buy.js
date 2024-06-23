const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
  },
  sellerName: {
    type: String,
    required: true,
  },
  buyerName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  poster: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Buy', transactionSchema);
