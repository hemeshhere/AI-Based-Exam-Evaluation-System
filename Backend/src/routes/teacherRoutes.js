import express from 'express';
import { verifyToken, authorize } from '../middlewares/authmiddleware.js';
import * as teacherController from '../controllers/teacherController.js';

const router = express.Router();

// Log all teacher route requests
router.use((req, res, next) => {
  console.log(`[TEACHER ROUTE] ${req.method} ${req.originalUrl}`);
  next();
});

// Verify token first
router.use(verifyToken);

// Then check for teacher role
router.use((req, res, next) => {
  console.log('Checking teacher authorization for user:', req.user?.email);
  next();
}, authorize('teacher'));

// Debug endpoint to check auth status
router.get('/debug/auth', (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user || null,
    headers: req.headers,
    timestamp: new Date().toISOString()
  });
});

// Update exam
router.put('/exams/:examId', teacherController.updateExam);

// Create a new exam
router.post('/exams', teacherController.createExam);

// Get all exams created by teacher
router.get('/exams', teacherController.getTeacherExams);

// Get submissions for an exam
router.get('/exams/:examId/submissions', teacherController.getExamSubmissions);

// Grade a submission
router.put('/submissions/:submissionId/grade', teacherController.gradeSubmission);

// Publish exam results
router.post('/exams/:examId/publish-results', teacherController.publishResults);

export default router;
