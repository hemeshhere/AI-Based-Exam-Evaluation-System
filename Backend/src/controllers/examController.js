// Import the Exam model for database operations
const Exam = require('../models/exam.model.js');

exports.createExam = async (req, res) => {
  try {
    const { title, description, date } = req.body;

    const exam = new Exam({
      title,
      description,
      date,
      createdBy: req.user._id
    });

    await exam.save();
    res.status(201).json({ message: 'Exam created successfully', exam });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
