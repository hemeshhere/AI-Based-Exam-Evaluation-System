import express from 'express';
import { 
  registerStudent,
  registerTeacher,
  login, 
  getMe 
} from '../controllers/authController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/api/v1/register/student', registerStudent);
router.post('/api/v1/register/teacher', registerTeacher);
router.post('/api/v1/login', login);

// Protected routes
router.get('/api/v1/me', verifyToken, getMe);

export default router;
