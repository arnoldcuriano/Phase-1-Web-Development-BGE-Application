const express = require('express');
const router = express.Router();
const itemDistributedController = require('../controllers/itemDistributedController');

// Routes for Item Distributed
router.get('/', itemDistributedController.getItems);
router.post('/add', itemDistributedController.addItem);
router.post('/update', itemDistributedController.updateItem);
router.post('/delete/:id', itemDistributedController.deleteItem);

module.exports = router;
