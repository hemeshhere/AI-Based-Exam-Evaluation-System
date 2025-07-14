import express from 'express';
import { createExam } from '../controllers/examController.js';
import auth from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', auth, createExam);

export default router;
