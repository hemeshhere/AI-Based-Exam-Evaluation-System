import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import Exam from '../models/exam.model.js';
import Submission from '../models/submission.model.js';

// Create a new exam
export const createExam = asyncHandler(async (req, res) => {
  const teacher = req.user;
  
  // Create exam object first
  const exam = new Exam({
    ...req.body,
    createdBy: teacher._id,
    employeeId: teacher.employeeId
  });
  
  // Save the exam (this will trigger the pre-save hook)
  await exam.save();
  
  // Convert to plain object and add access code to response
  const examObj = exam.toObject();
  
  const apiResponse = new ApiResponse(res);
  apiResponse.success(201, {
    ...examObj,
    accessCode: examObj.accessCode
  }, 'Exam created successfully');
});

// Get all exams created by teacher
export const getTeacherExams = asyncHandler(async (req, res) => {
  const teacher = req.user;
  
  const exams = await Exam.find({ createdBy: teacher._id })
    .select('-questions -answerKey -__v')
    .sort({ createdAt: -1 });
  
  if (exams.length === 0) {
    return res.status(200).json({
      status: 'success',
      message: 'No exams available',
      data: []
    });
  }
  
  return res.status(200).json({
    status: 'success',
    message: 'Exams fetched successfully',
    data: exams
  });
});

// Update exam status
export const updateExam = asyncHandler(async (req, res) => {
  const { examId } = req.params;
  const teacher = req.user;
  const { status } = req.body;

  // Verify teacher owns the exam
  const exam = await Exam.findOne({
    _id: examId,
    createdBy: teacher._id
  });

  if (!exam) {
    throw new ApiError(404, 'Exam not found');
  }

  // Update exam status
  exam.status = status;
  await exam.save();

  const apiResponse = new ApiResponse(res);
  apiResponse.success(200, exam, 'Exam status updated successfully');
});

// Get submissions for an exam
export const getExamSubmissions = asyncHandler(async (req, res) => {
  const { examId } = req.params;
  const teacher = req.user;
  
  // Verify teacher owns the exam
  const exam = await Exam.findOne({
    _id: examId,
    createdBy: teacher._id
  });
  
  if (!exam) {
    throw new ApiError(404, 'Exam not found');
  }
  
  const submissions = await Submission.find({ exam: examId })
    .populate('student', 'firstName lastName rollNumber')
    .select('-answers -__v');
  
  res.status(200).json(
    new ApiResponse(200, submissions, 'Submissions fetched successfully')
  );
});

// Grade a submission
export const gradeSubmission = asyncHandler(async (req, res) => {
  const { submissionId } = req.params;
  const { answers, totalMarks, remarks, isPassed } = req.body;
  const teacher = req.user;
  
  const submission = await Submission.findById(submissionId)
    .populate('exam', 'createdBy');
  
  if (!submission) {
    throw new ApiError(404, 'Submission not found');
  }
  
  // Verify teacher owns the exam
  if (submission.exam.createdBy.toString() !== teacher._id.toString()) {
    throw new ApiError(403, 'Not authorized to grade this submission');
  }
  
  // Update submission
  submission.answers = answers || submission.answers;
  submission.totalMarks = totalMarks !== undefined ? totalMarks : submission.totalMarks;
  submission.remarks = remarks || submission.remarks;
  submission.isPassed = isPassed !== undefined ? isPassed : submission.isPassed;
  submission.status = 'evaluated';
  submission.evaluatedBy = teacher._id;
  submission.evaluatedAt = new Date();
  
  await submission.save();
  
  res.status(200).json(
    new ApiResponse(200, submission, 'Submission graded successfully')
  );
});

// Publish exam results
export const publishResults = asyncHandler(async (req, res) => {
  const { examId } = req.params;
  const teacher = req.user;
  
  // Verify teacher owns the exam
  const exam = await Exam.findOne({
    _id: examId,
    createdBy: teacher._id
  });
  
  if (!exam) {
    throw new ApiError(404, 'Exam not found');
  }
  
  // Update all evaluated submissions to published
  const result = await Submission.updateMany(
    { 
      exam: examId,
      status: 'evaluated' 
    },
    { 
      $set: { status: 'published' } 
    }
  );
  
  res.status(200).json(
    new ApiResponse(200, result, 'Results published successfully')
  );
});

// Generate new access code for an existing exam
export const generateAccessCode = asyncHandler(async (req, res) => {
  const { examId } = req.params;
  
  const exam = await Exam.findById(examId);
  if (!exam) {
    throw new ApiError(404, 'Exam not found');
  }

  // Check if user is the creator of this exam
  if (exam.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You are not authorized to modify this exam');
  }

  // Generate a new unique access code
  let newAccessCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  // Ensure the access code is unique
  while (await Exam.findOne({ accessCode: newAccessCode })) {
    newAccessCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  exam.accessCode = newAccessCode;
  await exam.save();

  new ApiResponse(res).success(
    { accessCode: newAccessCode },
    'Access code generated successfully'
  );
});

export default {
  createExam,
  getTeacherExams,
  getExamSubmissions,
  gradeSubmission,
  publishResults
};
