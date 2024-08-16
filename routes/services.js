const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const Announcement = require('../models/Announcement'); // Import Announcement model
const serviceController = require('../controllers/serviceController');

// Get all services and announcements with pagination
router.get('/', async (req, res) => {
  if (!req.user) {
    return res.redirect('/auth/login');
  }
  const perPage = 10;
  const currentPage = parseInt(req.query.page) || 1;

  try {
    const totalServices = await Service.countDocuments();
    const totalPages = Math.ceil(totalServices / perPage);
    const services = await Service.find()
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    const announcements = await Announcement.find().sort({ date: -1 }); // Fetch announcements

    if (req.xhr) {
      res.json({ services, currentPage, totalPages, totalServices, announcements });
    } else {
      res.render('services', { services, announcements, user: req.user, currentPage, totalPages, totalServices });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Add a new service
router.post('/add', async (req, res) => {
  const { name, description, price } = req.body;
  try {
    const newService = new Service({ name, description, price });
    await newService.save();
    if (req.xhr) {
      return res.status(200).json({ message: 'Service added successfully!' });
    }
    res.redirect('/services');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Update a service
router.post('/update', async (req, res) => {
  const { id, name, description, price } = req.body;
  try {
    await Service.findByIdAndUpdate(id, { name, description, price });
    if (req.xhr) {
      return res.status(200).json({ message: 'Service updated successfully!' });
    }
    res.redirect('/services');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Delete a service
router.post('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Service.findByIdAndDelete(id);
    if (req.xhr) {
      return res.status(200).json({ message: 'Service deleted successfully!' });
    }
    res.redirect('/services');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Get service by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const service = await Service.findById(id);
    res.json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error });
  }
});

module.exports = router;
