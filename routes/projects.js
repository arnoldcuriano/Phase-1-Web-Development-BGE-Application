// routes/projects.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const projectController = require('../controllers/projectController');

// Ensure uploads directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /doc|docx|xls|xlsx|pdf/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only .doc, .docx, .xls, .xlsx, and .pdf files are allowed!'));
  }
});

// Routes
router.get('/', projectController.getProjects);
router.post('/add', upload.array('fileUpload', 10), projectController.addProject); // Allow up to 10 files
router.post('/update', upload.array('fileUpload', 10), projectController.updateProject);
router.post('/delete/:id', projectController.deleteProject);
router.get('/download/:id', projectController.downloadFile);

module.exports = router;
