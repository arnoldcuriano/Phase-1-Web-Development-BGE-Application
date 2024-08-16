const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Route to add a new event
router.post('/add', async (req, res) => {
    const { title, details, date } = req.body;

    try {
        const newEvent = new Event({ title, details, date });
        await newEvent.save();
        res.redirect('/hr-department'); // Redirect to the management page or any other page as needed
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Route to edit an event
router.post('/edit/:id', async (req, res) => {
    const { title, details, date } = req.body;

    try {
        const event = await Event.findByIdAndUpdate(req.params.id, { title, details, date }, { new: true });
        if (!event) {
            return res.status(404).send('Event not found');
        }
        res.redirect('/hr-department');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Route to delete an event------------------
router.delete('/delete/:id', async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).send('Event not found');
        }
        res.status(200).send('Event deleted successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
