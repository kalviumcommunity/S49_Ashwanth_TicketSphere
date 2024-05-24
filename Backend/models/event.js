const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
  },
  eventLocation: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  poster: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    required: true,
  },
  sellerName: {
    type: String,
    required: true, 
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  }
});

module.exports = mongoose.model('Event', eventSchema);
