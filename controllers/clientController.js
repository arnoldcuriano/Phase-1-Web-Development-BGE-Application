const Client = require('../models/Client');
const Project = require('../models/Project');
const Service = require('../models/Service');

exports.getClients = async (req, res, returnDataOnly = false) => {
  try {
    const clients = await Client.find()
      .populate('projects')
      .populate('services');

    const projects = await Project.find();
    const services = await Service.find();

    if (returnDataOnly) {
      return { clients, projects, services };
    }

    res.render('clients', { clients, projects, services, user: req.user });
  } catch (error) {
    console.error('Error fetching clients:', error);
    if (!returnDataOnly) {
      res.status(500).send('Error fetching clients');
    }
    throw error;
  }
};

exports.addClient = async (req, res) => {
  try {
    const { name, projects, services, status } = req.body;

    const newClient = new Client({
      name,
      projects: Array.isArray(projects) ? projects : [projects],
      services: Array.isArray(services) ? services : [services],
      status
    });

    await newClient.save();
    res.redirect('/clients');
  } catch (error) {
    console.error('Error adding client:', error);
    res.status(500).send('Error adding client');
  }
};

exports.updateClient = async (req, res) => {
  try {
    const { id, name, projects, services, status } = req.body;

    await Client.findByIdAndUpdate(id, {
      name,
      projects: Array.isArray(projects) ? projects : [projects],
      services: Array.isArray(services) ? services : [services],
      status
    });

    res.redirect('/clients');
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).send('Error updating client');
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    await Client.findByIdAndDelete(id);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).send('Error deleting client');
  }
};
