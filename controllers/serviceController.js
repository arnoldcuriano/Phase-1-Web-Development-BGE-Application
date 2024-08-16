const Service = require('../models/Service');

exports.updateService = async (req, res) => {
  try {
    const { id, name, description } = req.body;
    await Service.findByIdAndUpdate(id, { name, description });
    res.status(200).send('Service updated successfully');
  } catch (error) {
    res.status(500).send('Error updating service');
  }
};
