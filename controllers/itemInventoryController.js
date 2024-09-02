const ItemInventory = require('../models/ItemInventory');
const Category = require('../models/Category');
const Announcement = require('../models/Announcement'); // Import Announcement model


// Get items with pagination
exports.getItems = async (req, res) => {
  try {
    const itemsPerPage = 10; // Define the number of items per page
    const page = parseInt(req.query.page) || 1; // Default to page 1 if no page parameter is provided
    const skip = (page - 1) * itemsPerPage;

    const totalItems = await ItemInventory.countDocuments(); // Ensure you use the correct model
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const items = await ItemInventory.find()
      .skip(skip)
      .limit(itemsPerPage)
      .populate('category'); // Populate category if it's a reference

    // Fetch all categories for dropdown
    const categories = await Category.find();

    // Fetch all announcements
    const announcements = await Announcement.find(); // Fetch all announcements from the database

    res.render('itemInventory', {
      items,
      currentPage: page,
      totalPages,
      itemsPerPage, // Pass itemsPerPage to the view
      categories, // Pass categories to the view
      announcements // Pass announcements to the view
    });
  } catch (error) {
    console.error('Error fetching items:', error.message); // Improved error logging
    res.status(500).send('Server Error');
  }
};

// Add a new item
exports.addItem = async (req, res) => {
  try {
    const { itemName, category, serialNumber, quantity, inDate } = req.body;
    const newItem = new ItemInventory({
      itemName,
      category,
      serialNumber,
      quantity,
      inDate
    });
    await newItem.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Error adding item:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update an existing item
exports.updateItem = async (req, res) => {
  try {
    const { _id, itemName, category, serialNumber, quantity, inDate } = req.body;
    const updatedItem = await ItemInventory.findByIdAndUpdate(_id, {
      itemName,
      category,
      serialNumber,
      quantity,
      inDate
    }, { new: true });

    if (updatedItem) {
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, error: 'Item not found' });
    }
  } catch (error) {
    console.error('Error updating item:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete an item
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await ItemInventory.findByIdAndDelete(id);

    if (deletedItem) {
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, error: 'Item not found' });
    }
  } catch (error) {
    console.error('Error deleting item:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
