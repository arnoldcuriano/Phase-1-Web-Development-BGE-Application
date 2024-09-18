// models/Category.js
const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  description: { type: String, default: '' },
  active: { type: Boolean, default: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Category', CategorySchema);


