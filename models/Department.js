const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    head: {
        type: String,
        required: true
    }
});

module.exports = mongoose.models.Department || mongoose.model('Department', departmentSchema);