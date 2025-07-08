const User = require('./userModel');
const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  department: String,
  designation: String
});

module.exports = User.discriminator('teacher', teacherSchema);
