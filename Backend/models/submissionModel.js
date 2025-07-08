const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  answerText: String,
  selectedOption: String,
  score: Number,
  feedback: String,
  evaluatedByAI: Boolean,
  reviewedByTeacher: Boolean
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);
