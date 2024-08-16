const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const Event = require('../models/Event');

// Route to get announcements and events
router.get('/', async (req, res) => {
    if (!req.user) {
        return res.redirect('/auth/login');
    }

    const announcements = await Announcement.find().sort({ date: -1 });
    const events = await Event.find().sort({ date: 1 }); // Fetch events sorted by date ascending

    res.render('management', { announcements, events, user: req.user });
});

// Route to add a new announcement
router.post('/announcements/add', async (req, res) => {
    try {
        const { title, description } = req.body;
        const newAnnouncement = new Announcement({ title, description, date: new Date() });
        await newAnnouncement.save();
        res.redirect('/hr-department');
    } catch (error) {
        console.error('Error adding announcement:', error);
        res.status(500).send('Server Error');
    }
});

// Route to edit an announcement
router.post('/announcements/edit/:id', async (req, res) => {
    try {
        const { title, description } = req.body;
        await Announcement.findByIdAndUpdate(req.params.id, { title, description });
        res.redirect('/hr-department');
    } catch (error) {
        console.error('Error editing announcement:', error);
        res.status(500).send('Server Error');
    }
});

// Route to delete an announcement
router.delete('/announcements/delete/:id', async (req, res) => {
    try {
        await Announcement.findByIdAndDelete(req.params.id);
        res.sendStatus(200);
    } catch (error) {
        console.error('Error deleting announcement:', error);
        res.status(500).send('Server Error');
    }
});

// Route to add a new event
router.post('/events/add', async (req, res) => {
    try {
        const { title, details, date } = req.body;
        const newEvent = new Event({ title, details, date });
        await newEvent.save();
        res.redirect('/hr-department');
    } catch (error) {
        console.error('Error adding event:', error);
        res.status(500).send('Server Error');
    }
});

// Route to edit an event
router.post('/events/edit/:id', async (req, res) => {
    try {
        const { title, details, date } = req.body;
        await Event.findByIdAndUpdate(req.params.id, { title, details, date });
        res.redirect('/hr-department');
    } catch (error) {
        console.error('Error editing event:', error);
        res.status(500).send('Server Error');
    }
});

// Route to delete an event
router.delete('/events/delete/:id', async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.sendStatus(200);
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
