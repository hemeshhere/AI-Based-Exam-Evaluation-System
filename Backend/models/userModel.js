const mongoose = require('mongoose');
const options = { discriminatorKey: 'role', timestamps: true };
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
  firstName: String,
  secondName: String,
  email: { type: String, unique: true },
  password: String
}, options);


// Encrypt password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });
  
// Compare passwords
userSchema.methods.matchPassword = function (enteredPassword) {
return bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model('User', userSchema);
