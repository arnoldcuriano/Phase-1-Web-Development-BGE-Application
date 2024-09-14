const express = require('express');
const router = express.Router();
const ItemInventoryController = require('../controllers/itemInventoryController');
const Announcement = require('../models/Announcement');

// Ensure routes are correctly mapped
router.post('/add', ItemInventoryController.addItem);
router.put('/update', ItemInventoryController.updateItem);
router.delete('/delete/:id', ItemInventoryController.deleteItem);

// The key route where DataTables fetches data
router.post('/data', ItemInventoryController.getItems); // This is the crucial route for DataTables

router.get('/', ItemInventoryController.getItems);

module.exports = router;
