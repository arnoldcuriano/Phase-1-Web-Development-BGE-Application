const ItemDistributed = require('../models/ItemDistributed');
const Member = require('../models/Member');
const Department = require('../models/Department');
const Category = require('../models/Category');
const ItemInventory = require('../models/ItemInventory');
const Announcement = require('../models/Announcement');

exports.getItems = async (req, res) => {
  try {
    const items = await ItemDistributed.find()
      .populate('member')
      .populate('department')
      .populate('category')
      .populate('items');

    const members = await Member.find();
    const departments = await Department.find();
    const categories = await Category.find();
    const inventoryItems = await ItemInventory.find();
    const announcements = await Announcement.find(); // Fetch announcements

    res.render('itemDistributed', {
      items,
      members,
      departments,
      categories,
      inventoryItems,
      announcements, // Pass announcements to the EJS template
      user: req.user
    });
  } catch (error) {
    console.error('Error fetching items:', error.message);
    res.status(500).send('Error fetching items');
  }
};

exports.addItem = async (req, res) => {
  try {
    const { member, department, category, qty, items } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Please select at least one item.' });
    }

    const newItem = new ItemDistributed({
      member,
      department,
      category,
      qty, // This will now be stored as an array
      items
    });

    await newItem.save();
    res.status(201).json({ message: 'Item added successfully', item: newItem });
  } catch (error) {
    console.error('Error adding item:', error.message);
    res.status(500).json({ message: 'Error adding item', error: error.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { id, member, department, category, qty, items } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Please select at least one item.' });
    }

    const updatedItem = await ItemDistributed.findByIdAndUpdate(id, {
      member,
      department,
      category,
      qty, // This will now be stored as an array
      items
    }, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ message: 'Item updated successfully', item: updatedItem });
  } catch (error) {
    console.error('Error updating item:', error.message);
    res.status(500).json({ message: 'Error updating item', error: error.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const deletedItem = await ItemDistributed.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error.message);
    res.status(500).json({ message: 'Error deleting item', error: error.message });
  }
};