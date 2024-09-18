const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Middleware to check user authentication
const isAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.redirect('/auth/login');
  }
  next();
};

// Get all categories
router.get('/', isAuthenticated, categoryController.getCategories);

// Add or update a category
router.post('/add', isAuthenticated, categoryController.addOrUpdateCategory);

// Delete a category
router.post('/delete/:id', isAuthenticated, categoryController.deleteCategory);

module.exports = router;
