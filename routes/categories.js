const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const Announcement = require('../models/Announcement'); // Import Announcement model

// Middleware to check user authentication
const isAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.redirect('/auth/login');
  }
  next();
};

// Get all categories and announcements with pagination
router.get('/', isAuthenticated, async (req, res) => {
  try {
    // Fetch paginated categories
    const { categories, totalPages, currentPage } = await categoryController.getCategories(req, res, true);
    
    // Fetch announcements sorted by date
    const announcements = await Announcement.find().sort({ date: -1 });
    
    // Render categories and announcements
    res.render('categories', { categories, announcements, user: req.user, totalPages, currentPage });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Add a new category
router.post('/add', isAuthenticated, categoryController.addCategory);

// Update an existing category
router.post('/update', isAuthenticated, categoryController.updateCategory);

// Check if a category has child categories and provide reassignment options
router.get('/check-child-categories/:id', isAuthenticated, categoryController.checkChildCategories);

// Delete a category by ID
router.post('/delete/:id', isAuthenticated, categoryController.deleteCategory);

module.exports = router;
