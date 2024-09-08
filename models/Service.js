const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  currency: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Service', ServiceSchema);