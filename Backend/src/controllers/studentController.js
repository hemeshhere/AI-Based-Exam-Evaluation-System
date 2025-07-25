import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import Exam from '../models/exam.model.js';
import Submission from '../models/submission.model.js';

// @desc    Get timetable for the logged-in student
// @route   GET /api/v1/student/timetable
export const getStudentTimetable = asyncHandler(async (req, res) => {
    const student = req.user;
    const timetable = await Exam.find({
        department: student.department,
        year: student.year,
        semester: student.semester,
        section: student.section,
    })
    .populate('createdBy', 'firstName lastName')
    .select('-questions -allowedRollNumbers -__v')
    .sort({ date: 1, startTime: 1 });
    return new ApiResponse(res).success(200, timetable, 'Timetable fetched successfully.');
});

// @desc    Get all of today's exams for a student
// @route   GET /api/v1/student/exams/active
export const getTodaysExams = asyncHandler(async (req, res) => {
  const student = req.user;
  
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  const exams = await Exam.find({
    department: student.department,
    year: student.year, 
    section: student.section,
    startTime: { $gte: startOfDay, $lte: endOfDay },
    $or: [
      { allowedRollNumbers: { $size: 0 } },
      { allowedRollNumbers: student.rollNumber }
    ]
  })
  .select('-questions -answerKey -createdBy -__v')
  .sort({ startTime: 1 })
  .lean();

  return new ApiResponse(res).success(200, exams, 'Today\'s exams fetched successfully');
});

// @desc    Start an exam and create a submission
// @route   POST /api/v1/student/exams/:examId/start
export const startExam = asyncHandler(async (req, res) => {
  const { examId } = req.params;
  const { accessCode } = req.body;
  const student = req.user;
  
  if (!accessCode) {
    throw new ApiError(400, 'Access code is required');
  }

  const exam = await Exam.findById(examId).populate('questions');
  if (!exam) {
    throw new ApiError(404, 'Exam not found');
  }

  const canAccess = await exam.canAccess(student, accessCode);
  if (!canAccess) {
    throw new ApiError(403, 'You do not have access to this exam');
  }

  const existingSubmission = await Submission.findOne({ exam: examId, student: student._id }).populate({ path: 'exam', populate: { path: 'questions' } });
  if (existingSubmission) {
    if (existingSubmission.status !== 'in_progress') {
      throw new ApiError(400, 'You have already submitted this exam');
    }
    return new ApiResponse(res).success(200, existingSubmission, 'Continue your exam');
  }
  
  const submission = await Submission.create({
    exam: examId,
    student: student._id,
    answers: exam.questions.map(question => ({ question: question._id, response: '' }))
  });

  const populatedSubmission = await Submission.findById(submission._id)
    .populate({
        path: 'exam',
        populate: {
            path: 'questions'
        }
    });
  
  return new ApiResponse(res).success(201, populatedSubmission, 'Exam started successfully');
});

// @desc    Submit exam answers
// @route   PUT /api/v1/student/submissions/:submissionId/submit
export const submitExam = asyncHandler(async (req, res) => {
  const { submissionId } = req.params;
  const { answers } = req.body;
  const student = req.user;
  
  const submission = await Submission.findOne({ _id: submissionId, student: student._id, status: 'in_progress' });
  if (!submission) {
    throw new ApiError(404, 'Submission not found or already submitted');
  }
  
  const exam = await Exam.findById(submission.exam);
  const currentTime = new Date();
  if (currentTime > exam.endTime) {
    throw new ApiError(400, 'Exam time has ended');
  }
  
  submission.answers = answers;
  submission.status = 'submitted';
  submission.submittedAt = currentTime;
  await submission.save();
  
  return new ApiResponse(res).success(200, submission, 'Exam submitted successfully');
});

// @desc    Get exam result for a student
// @route   GET /api/v1/student/results/:submissionId
export const getExamResult = asyncHandler(async (req, res) => {
    const { submissionId } = req.params;
    const student = req.user;
    
    const submission = await Submission.findOne({ _id: submissionId, student: student._id, status: { $in: ['evaluated', 'published'] } })
      .populate('exam')
      .populate('evaluatedBy', 'firstName lastName');
    
    if (!submission) {
      throw new ApiError(404, 'Result not available yet');
    }
    
    return new ApiResponse(res).success(200, submission, 'Exam result fetched successfully');
});


export const getStudentResults = asyncHandler(async (req, res) => {
  const studentId = req.user._id;

  const results = await Submission.find({ student: studentId, status: 'published' })
      .populate({
          path: 'exam',
          select: 'title department totalMarks createdBy', // Select specific fields from the exam
          populate: {
              path: 'createdBy',
              select: 'firstName lastName' // Get the teacher's name
          }
      })
      .sort({ submittedAt: -1 });

  return new ApiResponse(res).success(200, results, 'Results fetched successfully.');
});
