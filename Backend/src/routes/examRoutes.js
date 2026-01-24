import express from 'express';
import { createExam } from '../controllers/examController.js';
import auth from '../middlewares/authmiddleware.js';

const router = express.Router();

// Redirects to for creating exam
router.post('/', auth, createExam);

export default router;
