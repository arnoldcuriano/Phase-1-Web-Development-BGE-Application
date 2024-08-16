const ItemDistributed = require('../models/ItemDistributed');
const Member = require('../models/Member');
const Department = require('../models/Department');
const Category = require('../models/Category');

exports.getItems = async (req, res) => {
  try {
    const items = await ItemDistributed.find().populate('member').populate('department').populate('category');
    const members = await Member.find();
    const departments = await Department.find();
    const categories = await Category.find();
    res.render('itemDistributed', { items, members, departments, categories, user: req.user });
  } catch (error) {
    res.status(500).send('Error fetching items');
  }
};

exports.addItem = async (req, res) => {
  try {
    const { member, department, category, qty } = req.body;
    const newItem = new ItemDistributed({ member, department, category, qty });
    await newItem.save();
    res.redirect('/it/item-distributed');
  } catch (error) {
    res.status(500).send('Error adding item');
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { id, member, department, category, qty } = req.body;
    await ItemDistributed.findByIdAndUpdate(id, { member, department, category, qty });
    res.redirect('/it/item-distributed');
  } catch (error) {
    res.status(500).send('Error updating item');
  }
};

exports.deleteItem = async (req, res) => {
  try {
    await ItemDistributed.findByIdAndDelete(req.params.id);
    res.redirect('/it/item-distributed');
  } catch (error) {
    res.status(500).send('Error deleting item');
  }
};
