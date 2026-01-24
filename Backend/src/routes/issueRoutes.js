import express from 'express';
import { verifyToken, authorize } from '../middlewares/authmiddleware.js';
import { createIssue, getStudentIssues, getTeacherIssues, replyToIssue } from '../controllers/issueController.js';

const router = express.Router();

// Verifies a user is logged-in
router.use(verifyToken);

// Student Routes 
router.post('/', authorize('student'), createIssue);
router.get('/student', authorize('student'), getStudentIssues);

// Teacher Routes 
router.get('/teacher', authorize('teacher'), getTeacherIssues);
router.put('/:id/reply', authorize('teacher'), replyToIssue);

export default router;
