const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const Announcement = require('../models/Announcement');
const serviceController = require('../controllers/serviceController');

// Get all services and announcements with pagination
router.get('/', async (req, res) => {
  if (!req.user) {
    return res.redirect('/auth/login');
  }

  const start = parseInt(req.query.start) || 0;
  const length = parseInt(req.query.length) || 10;
  const search = req.query.search ? req.query.search.value : '';

  try {
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const totalServices = await Service.countDocuments(query);
    const services = await Service.find(query)
      .skip(start)
      .limit(length);
    const announcements = await Announcement.find().sort({ date: -1 });

    if (req.xhr) {
      res.json({
        draw: parseInt(req.query.draw),
        recordsTotal: totalServices,
        recordsFiltered: totalServices,
        data: services,
        announcements: announcements
      });
    } else {
      res.render('services', { 
        services, 
        announcements, 
        user: req.user, 
        totalServices 
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Add a new service
router.post('/add', async (req, res) => {
  const { name, description, price, currency } = req.body;

  if (!name || !currency || price === undefined) {
    return res.status(400).send('Missing required fields');
  }

  try {
    const newService = new Service({ 
      name, 
      description, 
      price: parseFloat(price), 
      currency 
    });

    await newService.save();
    res.status(200).json({ message: 'Service added successfully!' });
  } catch (error) {
    console.error('Error adding service:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Update a service
router.post('/update', async (req, res) => {
  const { id, name, description, price } = req.body;
  try {
    await Service.findByIdAndUpdate(id, { name, description, price });
    res.status(200).json({ message: 'Service updated successfully!' });
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
    res.status(200).json({ message: 'Service deleted successfully!' });
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