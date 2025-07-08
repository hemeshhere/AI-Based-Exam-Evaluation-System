const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      required: true,
    },
    questionType: {
      type: String,
      enum: ['mcq', 'subjective'],
      required: true,
    },
    questionText: {
      type: String,
      required: true,
      trim: true,
    },
    // MCQ fields
    options: {
      type: [String],
      validate: {
        validator: function (v) {
          // Options are required only for MCQ
          return this.questionType !== 'mcq' || (Array.isArray(v) && v.length >= 2);
        },
        message: 'At least two options are required for MCQ questions.',
      },
      default: undefined, // Avoid empty array for subjective
    },
    correctAnswer: {
      type: String,
      validate: {
        validator: function (v) {
          return this.questionType !== 'mcq' || !!v;
        },
        message: 'Correct answer is required for MCQ questions.',
      },
    },
    // Subjective field
    modelAnswer: {
      type: String,
      validate: {
        validator: function (v) {
          return this.questionType !== 'subjective' || !!v;
        },
        message: 'Model answer is required for subjective questions.',
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Question', questionSchema);