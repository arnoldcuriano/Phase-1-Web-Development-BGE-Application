const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemDistributedSchema = new Schema({
  member: { type: Schema.Types.ObjectId, ref: 'Member' },
  department: { type: Schema.Types.ObjectId, ref: 'Department' },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  qty: { 
    type: [Number], 
    required: true,
    get: v => v.join(','),
    set: v => Array.isArray(v) ? v : v.split(',').map(Number)
  },
  outDate: { type: Date, default: Date.now },
  items: [{ type: Schema.Types.ObjectId, ref: 'ItemInventory' }]
});

ItemDistributedSchema.set('toJSON', { getters: true });

module.exports = mongoose.model('ItemDistributed', ItemDistributedSchema);