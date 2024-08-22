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

// Centralized error handling middleware
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Get all categories and announcements with pagination
router.get('/', isAuthenticated, asyncHandler(async (req, res) => {
  // Fetch paginated categories and announcements
  const { categories, totalPages, currentPage } = await categoryController.fetchCategories(req);
  const announcements = await Announcement.find().sort({ date: -1 });

  // Render categories and announcements
  res.render('categories', { categories, announcements, user: req.user, totalPages, currentPage });
}));

// Add a new category
router.post('/add', isAuthenticated, asyncHandler(categoryController.addCategory));

// Update an existing category
router.post('/update', isAuthenticated, asyncHandler(categoryController.updateCategory));

// Check if a category has child categories and provide reassignment options
router.get('/check-child-categories/:id', isAuthenticated, asyncHandler(categoryController.checkChildCategories));

// Delete a category by ID
router.post('/delete/:id', isAuthenticated, asyncHandler(categoryController.deleteCategory));

// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong. Please try again later.');
});

module.exports = router;
