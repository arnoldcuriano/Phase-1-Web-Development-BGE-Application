  const express = require('express');
  const router = express.Router();
  const clientController = require('../controllers/clientController');
  const Announcement = require('../models/Announcement');

  router.get('/', async (req, res) => {
    if (!req.user) {
      return res.redirect('/auth/login');
    }
    try {
      const { clients, projects, services } = await clientController.getClients(req, res, true);
      const announcements = await Announcement.find().sort({ date: -1 });
      res.render('clients', { clients, projects, services, announcements, user: req.user });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });

  router.post('/add', clientController.addClient);
  router.post('/update', clientController.updateClient);
  router.post('/delete/:id', clientController.deleteClient);

  module.exports = router;
