// controllers/projectController.js
const Project = require('../models/Project');
const Department = require('../models/Department');
const Announcement = require('../models/Announcement'); // Import Announcement model
const fs = require('fs');
const path = require('path');

exports.getProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10; // Number of projects per page
    const skip = (page - 1) * limit;

    const [projects, totalProjects, departments, announcements] = await Promise.all([
      Project.find().populate('departmentHandler').skip(skip).limit(limit),
      Project.countDocuments(),
      Department.find(),
      Announcement.find() // Fetch all announcements
    ]);

    const totalPages = Math.ceil(totalProjects / limit);

    res.render('projects', {
      projects,
      departments,
      announcements, // Pass announcements to the view
      user: req.user || { profilePicture: '', name: 'Guest' }, // Ensure user is passed
      currentPage: page,
      totalPages,
      totalDepartments: totalProjects
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).send('Error fetching projects');
  }
};

exports.addProject = async (req, res) => {
  try {
    const { name, description, departmentHandler } = req.body;
    const fileUpload = req.files.map(file => `/uploads/${file.filename}`);
    const newProject = new Project({
      name,
      description,
      departmentHandler,
      fileUpload
    });
    await newProject.save();
    res.redirect('/projects');
  } catch (error) {
    console.error('Error adding project:', error);
    res.status(500).send('Error adding project');
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { id, name, description, departmentHandler } = req.body;
    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).send('Project not found');
    }

    const updateData = {
      name,
      description,
      departmentHandler
    };
    
    if (req.files.length > 0) {
      // Delete old files if they exist
      project.fileUpload.forEach(file => {
        fs.unlink(path.join(__dirname, '..', file), err => {
          if (err) {
            console.error('Error deleting old file:', err);
          }
        });
      });
      updateData.fileUpload = req.files.map(file => `/uploads/${file.filename}`);
    }

    await Project.findByIdAndUpdate(id, updateData);
    res.redirect('/projects');
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).send('Error updating project');
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);
    
    if (project && project.fileUpload.length > 0) {
      // Delete associated files if they exist
      project.fileUpload.forEach(file => {
        fs.unlink(path.join(__dirname, '..', file), err => {
          if (err) {
            console.error('Error deleting project file:', err);
          }
        });
      });
    }

    res.redirect('/projects');
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).send('Error deleting project');
  }
};

exports.downloadFile = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project || !project.fileUpload) {
      return res.status(404).send('File not found');
    }
    
    const file = path.join(__dirname, '..', req.query.file);
    res.download(file, path.basename(file)); // Set disposition and send it.
  } catch (err) {
    console.error('Error downloading file:', err);
    res.status(500).send('Server error');
  }
};
