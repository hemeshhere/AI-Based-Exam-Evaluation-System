import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    // ✅ FIXED: Changed ref from 'User' to 'Teacher'
    ref: 'Teacher', 
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  accessCode: {
    type: String,
    trim: true,
    unique: true,
    validate: {
      validator: function(v) {
        return v.length === 6;
      },
      message: 'Access code must be exactly 6 characters long'
    }
  },
  endTime: {
    type: Date,
    required: true
  },
  durationMinutes: {
    type: Number,
    required: true,
    min: 1
  },
  year: {
    type: String,
    required: true,
    enum: ['1', '2', '3', '4']
  },
  semester: {
    type: String,
    required: true,
    enum: ['1', '2', '3', '4', '5', '6', '7', '8']
  },
  batch: {
    type: String,
    required: true,
    trim: true
  },
  section: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  department: {
    type: String,
    required: true,
    trim: true,
    enum: [
      'Computer Science',
      'Information Technology',
      'Electronics',
      'Mechanical',
      'Civil',
      'Electrical',
      'Chemical',
      'Aerospace',
      'Biotechnology',
      'Other'
    ]
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  allowedRollNumbers: [{
    type: String,
    trim: true,
    uppercase: true
  }],
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'active', 'completed'],
    default: 'draft'
  }
}, { timestamps: true });

// Pre-save hook to generate access code
examSchema.pre('save', async function(next) {
  if (this.isNew && !this.accessCode) {
    let accessCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    // Ensure the access code is unique
    const Exam = mongoose.model('Exam', examSchema);
    while (await Exam.findOne({ accessCode })) {
      accessCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    }
    this.accessCode = accessCode;
  }
  next();
});

// Method to check if a student can access the exam
examSchema.methods.canAccess = async function(student, providedAccessCode) {
  if (!student) return false;
  if (this.status !== 'active') return false;
  if (this.accessCode !== providedAccessCode) return false;
  if (this.allowedRollNumbers.length > 0 && !this.allowedRollNumbers.includes(student.rollNumber)) return false;
  const now = new Date();
  if (now < this.startTime || now > this.endTime) return false;
  // Note: Your model doesn't have a 'batch' field on the student model, but does on the exam.
  // This check might need adjustment based on your final student model.
  // if (student.batch !== this.batch || student.section !== this.section) return false;
  return true;
};

const Exam = mongoose.model('Exam', examSchema);
export default Exam;
