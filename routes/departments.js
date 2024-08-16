const express = require('express');
const router = express.Router();
const Department = require('../models/Department');
const Announcement = require('../models/Announcement'); // Import Announcement model
const departmentController = require('../controllers/departmentController');

// Get all departments and announcements with pagination
router.get('/', async (req, res) => {
  if (!req.user) {
    return res.redirect('/auth/login');
  }
  const perPage = 10;
  const currentPage = parseInt(req.query.page) || 1;

  try {
    const totalDepartments = await Department.countDocuments();
    const totalPages = Math.ceil(totalDepartments / perPage);
    const departments = await Department.find()
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    const announcements = await Announcement.find().sort({ date: -1 }); // Fetch announcements

    if (req.xhr) {
      res.json({ departments, currentPage, totalPages, totalDepartments });
    } else {
      res.render('departments', { departments, announcements, user: req.user, currentPage, totalPages, totalDepartments });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Add a new department
router.post('/add', async (req, res) => {
  const { name, head } = req.body;
  try {
    const newDepartment = new Department({ name, head });
    await newDepartment.save();
    if (req.xhr) {
      return res.status(200).json({ message: 'Department added successfully!' });
    }
    res.redirect('/departments');
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error code
      return res.status(400).json({ message: 'Department name already exists. Please choose a different name.' });
    } else {
      console.error(error);
      return res.status(500).json({ message: 'Server Error', error });
    }
  }
});

// Update a department
router.post('/update', departmentController.updateDepartment);

// Edit a department
router.post('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { name, head } = req.body;
  try {
    await Department.findByIdAndUpdate(id, { name, head });
    res.redirect('/departments');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Delete a department
router.post('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Department.findByIdAndDelete(id);
    if (req.xhr) {
      return res.status(200).json({ message: 'Department deleted successfully!' });
    }
    res.redirect('/departments');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Get department by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const department = await Department.findById(id);
    res.json(department);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error });
  }
});

module.exports = router;
