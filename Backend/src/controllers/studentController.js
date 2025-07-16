import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import Exam from '../models/exam.model.js';
import Submission from '../models/submission.model.js';

// Get active exams for student
export const getActiveExams = asyncHandler(async (req, res) => {
  const student = req.user;
  const currentDate = new Date();
  
  // Find all active exams that match department, batch, and section
  const exams = await Exam.find({
    status: 'active',
    department: student.department,
    batch: student.batch,
    section: student.section,
    startTime: { $lte: currentDate },
    endTime: { $gte: currentDate },
    $or: [
      { allowedRollNumbers: { $size: 0 } }, // No specific roll numbers allowed (all can access)
      { allowedRollNumbers: student.rollNumber } // Or student's roll number is in allowed list
    ]
  })
  .select('-questions -answerKey -createdBy -__v')
  .lean();

  // If no exams found, return empty array
  if (!exams || exams.length === 0) {
    return res.status(200).json({
      success: true,
      message: 'No active exams available',
      data: []
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Active exams fetched successfully',
    data: exams
  });
});

// Start exam and create submission
export const startExam = asyncHandler(async (req, res) => {
  const { examId } = req.params;
  const { accessCode } = req.body;
  const student = req.user;
  
  if (!accessCode) {
    throw new ApiError(400, 'Access code is required');
  }

  // Get the exam
  const exam = await Exam.findById(examId)
    .populate('questions')
    .populate('createdBy', 'firstName lastName');
  
  if (!exam) {
    throw new ApiError(404, 'Exam not found');
  }

  // Check if student can access the exam with the provided access code
  const canAccess = await exam.canAccess(student, accessCode);
  if (!canAccess) {
    throw new ApiError(403, 'You do not have access to this exam');
  }

  // Check if student has already submitted
  const existingSubmission = await Submission.findOne({
    exam: examId,
    student: student._id,
    status: { $ne: 'published' }
  });
  
  if (existingSubmission) {
    if (existingSubmission.status !== 'in_progress') {
      throw new ApiError(400, 'You have already submitted this exam');
    }
    return res.status(200).json(
      new ApiResponse(200, existingSubmission, 'Continue your exam')
    );
  }
  
  // Create new submission
  const submission = await Submission.create({
    exam: examId,
    student: student._id,
    answers: exam.questions.map(question => ({
      question: question._id,
      response: ''
    }))
  });
  
  res.status(201).json(
    new ApiResponse(201, submission, 'Exam started successfully')
  );
});

// Submit exam answers
export const submitExam = asyncHandler(async (req, res) => {
  const { submissionId } = req.params;
  const { answers } = req.body;
  const student = req.user;
  
  // Find and validate submission
  const submission = await Submission.findOne({
    _id: submissionId,
    student: student._id,
    status: 'in_progress'
  }).populate('exam');
  
  if (!submission) {
    throw new ApiError(404, 'Submission not found or already submitted');
  }
  
  // Check if exam is still active
  const currentTime = new Date();
  if (currentTime > submission.exam.endTime) {
    throw new ApiError(400, 'Exam time has ended');
  }
  
  // Update submission
  submission.answers = answers;
  submission.status = 'submitted';
  submission.submittedAt = currentTime;
  await submission.save();
  
  res.status(200).json(
    new ApiResponse(200, submission, 'Exam submitted successfully')
  );
});

// Get exam result
export const getExamResult = asyncHandler(async (req, res) => {
  const { submissionId } = req.params;
  const student = req.user;
  
  const submission = await Submission.findOne({
    _id: submissionId,
    student: student._id,
    status: { $in: ['evaluated', 'published'] }
  }).populate('exam').populate('evaluatedBy', 'firstName lastName');
  
  if (!submission) {
    throw new ApiError(404, 'Result not available yet');
  }
  
  res.status(200).json(
    new ApiResponse(200, submission, 'Exam result fetched successfully')
  );
});

export default {
  getActiveExams,
  startExam,
  submitExam,
  getExamResult
};
