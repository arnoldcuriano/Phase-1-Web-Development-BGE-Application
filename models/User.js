const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    googleId: String,
    name: String,
    email: String,
    profilePicture: String,
    password: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

module.exports = mongoose.model('User', UserSchema);
