const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const Department = require('../models/Department');
const Service = require('../models/Service');
const Announcement = require('../models/Announcement');
const Event = require('../models/Event');
const Project = require('../models/Project');
const Client = require('../models/Client');

router.get('/', async (req, res) => {
    if (!req.user) {
        return res.redirect('/auth/login');
    }

    try {
        const members = await Member.find();
        const departments = await Department.find();
        const services = await Service.find();
        const announcements = await Announcement.find().sort({ date: -1 });
        const events = await Event.find().sort({ date: 1 });
        const clients = await Client.find().populate('projects').populate('services');
        const projects = await Project.find();

        // Initialize status counters
        let completedProjects = 0;
        let inProgressProjects = 0;
        let maintenanceProjects = 0;
        let overdueProjects = 0;  // Added this line to handle overdue projects

        // Iterate through each client to aggregate statuses
        clients.forEach(client => {
            const status = client.status.trim().toLowerCase(); // Normalize status
            switch (status) {
                case 'completed':
                    completedProjects += client.projects.length;
                    break;
                case 'on progress':
                    inProgressProjects += client.projects.length;
                    break;
                case 'maintenance':
                    maintenanceProjects += client.projects.length;
                    break;
                case 'overdue':
                    overdueProjects += client.projects.length;
                    break;
                default:
                    console.warn(`Unknown status: ${status}`);  // Handle unexpected statuses
                    break;
            }
        });

        // Total projects can be directly counted from the `projects` array
        const totalProjects = projects.length;

        res.render('dashboard', { 
            members, 
            departments,    
            services, 
            announcements, 
            events, 
            projects,   // Pass the raw projects data to the template
            clients, 
            completedProjects, 
            inProgressProjects, 
            maintenanceProjects,
            overdueProjects,  // Pass the overdue projects count
            totalProjects,  // Pass total project count
            user: req.user 
        });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).send("Error loading dashboard data.");
    }
});

module.exports = router;
