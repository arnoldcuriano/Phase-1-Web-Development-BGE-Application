const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    departmentHandler: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    fileUpload: [{ type: String }],
    date: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['On Progress', 'Completed', 'Maintainance', 'Overdue'],
        default: 'On Progress'
    }
});

module.exports = mongoose.models.Project || mongoose.model('Project', projectSchema);
