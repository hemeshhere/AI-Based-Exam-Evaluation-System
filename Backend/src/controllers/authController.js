const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('../models/teacherModel');
require('../models/student.models');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

exports.register = async (req, res) => {
  try {
    const { firstName, secondName, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const Model = role === 'teacher' ? require('../models/teacherModel')
               : role === 'student' ? require('../models/student.models')
               : User;

    const user = await Model.create({ firstName, secondName, email, password });
    const token = generateToken(user._id);

    res.status(201).json({ token, user: { id: user._id, firstName: user.firstName, secondName: user.secondName, role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    res.status(200).json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
