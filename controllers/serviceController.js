const Service = require('../models/Service');

exports.updateService = async (req, res) => {
  try {
    const { id, name, description, price, currency } = req.body;
    
    if (!id || !name || price === undefined || !currency) {
      return res.status(400).send('Missing required fields');
    }

    const updatedPrice = parseFloat(price);
    if (isNaN(updatedPrice)) {
      return res.status(400).send('Invalid price format');
    }

    await Service.findByIdAndUpdate(id, { 
      name, 
      description, 
      price: updatedPrice, 
      currency 
    });
    
    res.status(200).send('Service updated successfully');
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).send('Error updating service');
  }
};

exports.addService = async (req, res) => {
  try {
    const { name, description, price, currency } = req.body;
    
    if (!name || price === undefined || !currency) {
      return res.status(400).send('Missing required fields');
    }

    const newPrice = parseFloat(price);
    if (isNaN(newPrice)) {
      return res.status(400).send('Invalid price format');
    }

    console.log(`Received price: ${newPrice}`); // Debugging price input
    
    const newService = new Service({ 
      name, 
      description, 
      price: newPrice, 
      currency 
    });
    
    await newService.save();
    res.status(200).send('Service added successfully');
  } catch (error) {
    console.error('Error adding service:', error);
    res.status(500).send('Error adding service');
  }
};