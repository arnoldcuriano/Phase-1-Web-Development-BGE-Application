const express = require('express');
const router = express.Router();
const ItemInventoryController = require('../controllers/itemInventoryController'); // Correct path
const Announcement = require('../models/Announcement'); // Import Announcement model

// Route to add a new item
router.post('/add', ItemInventoryController.addItem);

// Route to update an existing item
router.put('/update', ItemInventoryController.updateItem);

// Route to delete an item
router.delete('/delete/:id', ItemInventoryController.deleteItem);

router.get('/', ItemInventoryController.getItems);// To get the items and render the view


module.exports = router;
