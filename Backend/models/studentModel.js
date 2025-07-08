const User = require('./userModel');
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  rollNumber: String,
  course: String
});

module.exports = User.discriminator('student', studentSchema);
