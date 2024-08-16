  const mongoose = require('mongoose');

  const MemberSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    role: String,
    teamLeader: String,
    equipments: [String],
    profilePicture: String, // Field for profile picture
    date: { type: Date, default: Date.now }
  });

  module.exports = mongoose.model('Member', MemberSchema);
