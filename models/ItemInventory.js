const mongoose = require('mongoose');

const ItemInventorySchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  serialNumber: { type: String, required: true },
  quantity: { type: Number, required: true },
  inDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ItemInventory', ItemInventorySchema);
