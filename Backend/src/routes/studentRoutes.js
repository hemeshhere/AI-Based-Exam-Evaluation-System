import express from 'express';
import { verifyToken, authorize } from '../middlewares/authmiddleware.js';
import * as studentController from '../controllers/studentController.js';

const router = express.Router();

// Apply authentication and authorization to all student routes
router.use(verifyToken, authorize('student'));

// Get student's timetable
router.get('/timetable', studentController.getStudentTimetable);

// Get all of today's exams
router.get('/exams/active', studentController.getTodaysExams);

// Start an exam (requires examId in params and access code in body)
router.post('/exams/:examId/start', studentController.startExam);

// Submit answers for an ongoing exam
router.put('/submissions/:submissionId/submit', studentController.submitExam);

//Shows either exam is ongoing
router.get('/submissions/session/:submissionId', studentController.getSubmissionById);

// Get the result of a submitted exam
router.get('/results/:submissionId', studentController.getExamResult);

// Get student results
router.get('/results', studentController.getStudentResults);

export default router;
