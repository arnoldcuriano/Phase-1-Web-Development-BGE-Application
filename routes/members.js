const express = require('express');
const router = express.Router();
const multer = require('multer');
const Member = require('../models/Member');
const Announcement = require('../models/Announcement'); // Import the Announcement model

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Get all members and announcements with pagination
router.get('/', async (req, res) => {
  if (!req.user) {
    return res.redirect('/auth/login');
  }
  const perPage = 10;
  const currentPage = parseInt(req.query.page) || 1;

  try {
    const totalMembers = await Member.countDocuments();
    const totalPages = Math.ceil(totalMembers / perPage);
    const members = await Member.find()
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    const announcements = await Announcement.find().sort({ date: -1 }); // Fetch announcements

    if (req.xhr) {
      res.json({ members, currentPage, totalPages, totalMembers });
    } else {
      res.render('members', { members, announcements, user: req.user, currentPage, totalPages, totalMembers });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Add a new member
router.post('/add', upload.single('profilePicture'), async (req, res) => {
  try {
    const { firstName, lastName, email, phone, role, teamLeader, equipments } = req.body;
    const profilePicture = req.file ? `/uploads/${req.file.filename}` : '';
    const newMember = new Member({
      firstName,
      lastName,
      email,
      phone,
      role,
      teamLeader,
      equipments: equipments.split(',').map(e => e.trim()),
      profilePicture
    });
    await newMember.save();
    res.redirect('/members');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Update member
router.post('/update', upload.single('profilePicture'), async (req, res) => {
  const { id, firstName, lastName, email, phone, role, teamLeader, equipments } = req.body;
  const profilePicture = req.file ? `/uploads/${req.file.filename}` : undefined;

  try {
    const member = await Member.findById(id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    member.firstName = firstName;
    member.lastName = lastName;
    member.email = email;
    member.phone = phone;
    member.role = role;
    member.teamLeader = teamLeader;
    member.equipments = equipments.split(',').map(e => e.trim());
    if (profilePicture) {
      member.profilePicture = profilePicture;
    }

    await member.save();
    res.redirect('/members');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Delete member
router.delete('/delete/:id', async (req, res) => {
  try {
    await Member.findByIdAndDelete(req.params.id);
    res.status(200).send('Member deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Get member by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const member = await Member.findById(id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
