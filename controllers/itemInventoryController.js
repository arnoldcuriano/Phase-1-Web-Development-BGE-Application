const ItemInventory = require('../models/ItemInventory');
const Category = require('../models/Category');
const Announcement = require('../models/Announcement');

// Helper function to send JSON response
const sendJsonResponse = (res, status, data) => {
  res.status(status).json(data);
};

// Get items with pagination
exports.getItems = async (req, res) => {
  try {
    const isAjax = req.xhr || req.headers.accept.indexOf('json') > -1;

    // Common query setup
    const searchValue = isAjax ? req.body.search.value : req.query.search;
    let query = {};
    if (searchValue) {
      query = {
        $or: [
          { itemName: { $regex: searchValue, $options: 'i' } },
          { serialNumber: { $regex: searchValue, $options: 'i' } }
        ]
      };
    }

    const totalItems = await ItemInventory.countDocuments(query);

    if (isAjax) {
      // Handle DataTables AJAX request
      const draw = parseInt(req.body.draw);
      const start = parseInt(req.body.start);
      const length = parseInt(req.body.length);

      const items = await ItemInventory.find(query)
        .skip(start)
        .limit(length)
        .populate('category');

      const data = items.map(item => ({
        ...item.toObject(),
        category: item.category || { _id: null, name: 'Unassigned' }
      }));

      return res.json({
        draw: draw,
        recordsTotal: totalItems,
        recordsFiltered: totalItems,
        data: data
      });
    } else {
      // Handle initial page render
      const page = parseInt(req.query.page) || 1;
      const itemsPerPage = 10; // You can make this configurable if needed
      const skip = (page - 1) * itemsPerPage;

      const items = await ItemInventory.find(query)
        .skip(skip)
        .limit(itemsPerPage)
        .populate('category');

      const categories = await Category.find();
      const announcements = await Announcement.find();

      const totalPages = Math.ceil(totalItems / itemsPerPage);

      res.render('itemInventory', {
        items: items,
        currentPage: page,
        totalPages: totalPages,
        itemsPerPage: itemsPerPage,
        categories: categories,
        announcements: announcements
      });
    }
  } catch (error) {
    console.error('Error in getItems:', error);
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.status(500).json({ error: 'Server Error', details: error.message });
    }
    res.status(500).send('Server Error');
  }
};

// Add a new item
exports.addItem = async (req, res) => {
  try {
    const { itemName, category, serialNumber, quantity, inDate } = req.body;
    console.log('Received item data:', req.body);

    const newItem = new ItemInventory({
      itemName,
      category,
      serialNumber,
      quantity,
      inDate
    });

    const savedItem = await newItem.save();
    console.log('Item saved successfully:', savedItem);

    sendJsonResponse(res, 201, { success: true, item: savedItem });
  } catch (error) {
    console.error('Error adding item:', error);
    sendJsonResponse(res, 500, { success: false, error: error.message });
  }
};

// Update an existing item
exports.updateItem = async (req, res) => {
  try {
    const { _id, itemName, category, serialNumber, quantity, inDate } = req.body;

    const categoryExists = category ? await Category.findById(category) : false;

    if (!categoryExists && category) {
      return sendJsonResponse(res, 400, { success: false, error: 'Selected category does not exist' });
    }

    const updatedItem = await ItemInventory.findByIdAndUpdate(_id, {
      itemName,
      category: categoryExists ? category : null,
      serialNumber,
      quantity,
      inDate
    }, { new: true });

    if (updatedItem) {
      sendJsonResponse(res, 200, { success: true, item: updatedItem });
    } else {
      sendJsonResponse(res, 404, { success: false, error: 'Item not found' });
    }
  } catch (error) {
    console.error('Error updating item:', error);
    sendJsonResponse(res, 500, { success: false, error: error.message });
  }
};

// Delete an item
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await ItemInventory.findByIdAndDelete(id);

    if (deletedItem) {
      sendJsonResponse(res, 200, { success: true });
    } else {
      sendJsonResponse(res, 404, { success: false, error: 'Item not found' });
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    sendJsonResponse(res, 500, { success: false, error: error.message });
  }
};