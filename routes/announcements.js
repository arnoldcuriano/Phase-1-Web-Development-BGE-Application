const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');

// Route to get the management page with announcements
router.get('/management', async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ date: -1 });
        res.render('management', { announcements });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// POST route to add a new announcement
router.post('/add', async (req, res) => {
    const { title, description } = req.body;
    
    if (!title || !description) {
        return res.status(400).send('Title and description are required.');
    }
    
    try {
        const newAnnouncement = new Announcement({ title, description });
        await newAnnouncement.save();
        res.redirect('/hr-department'); // Redirect to the management page or another appropriate page
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// POST route to update an announcement
router.post('/edit/:id', async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).send('Title and description are required.');
    }

    try {
        const announcement = await Announcement.findByIdAndUpdate(req.params.id, { title, description }, { new: true });
        if (!announcement) {
            return res.status(404).send('Announcement not found');
        }
        res.redirect('/hr-department');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// DELETE route to delete an announcement
router.delete('/delete/:id', async (req, res) => {
    try {
        const announcement = await Announcement.findByIdAndDelete(req.params.id);
        if (!announcement) {
            return res.status(404).send('Announcement not found');
        }
        res.status(200).send('Announcement deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
