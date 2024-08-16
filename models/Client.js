const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
  status: { 
    type: String, 
    enum: ['On Progress', 'Completed', 'Maintenance', 'Overdue'], // Corrected "Maintainance" to "Maintenance"
    default: 'On Progress' 
  },
  termsFile: String,
});

module.exports = mongoose.models.Client || mongoose.model('Client', clientSchema);
