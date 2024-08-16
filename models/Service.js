const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number, // Ensure this field is defined as a number
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Service', ServiceSchema);
