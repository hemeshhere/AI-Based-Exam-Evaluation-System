import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300
  },
  isCorrect: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const questionSchema = new mongoose.Schema({
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['MCQ', 'Subjective']
  },
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  options: {
    type: [optionSchema],
    validate: {
      validator: function (v) {
        if (this.type === 'MCQ') return v && v.length >= 2;
        if (this.type === 'Subjective') return !v || v.length === 0;
        return true;
      },
      message: 'MCQ questions must have at least 2 options. Subjective questions should not have options.'
    },
    default: undefined
  },
  marks: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  topic: {
    type: String,
    trim: true,
    maxlength: 100
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    // ✅ FIXED: Changed ref from 'User' to 'Teacher'
    ref: 'Teacher',
    required: true
  }
}, { timestamps: true });

const Question = mongoose.model('Question', questionSchema);
export default Question;
