import express from 'express';
import { verifyToken, authorize } from '../middlewares/authmiddleware.js';
import * as studentController from '../controllers/studentController.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyToken);
router.use(authorize('student'));

// Get active exams for student
router.get('/exams/active', studentController.getActiveExams);

router.get('/timetable', studentController.getStudentTimetable);

router.get('/exams/active', studentController.getActiveExams);

// Start an exam
router.post('/exams/:examId/start', studentController.startExam);

// Submit exam answers
router.put('/submissions/:submissionId/submit', studentController.submitExam);

// Get exam result
router.get('/results/:submissionId', studentController.getExamResult);

export default router;
