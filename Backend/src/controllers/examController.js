import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import Exam from '../models/exam.model.js';

export const createExam = asyncHandler(async (req, res) => {
  const { title, description, date } = req.body;
  if (!title || !description || !date) {
    throw ApiError.BadRequest('All fields (title, description, date) are required');
  }
  const exam = new Exam({
    title,
    description,
    date,
    createdBy: req.user?._id
  });
  await exam.save();
  new ApiResponse(res).success(exam, 'Exam created successfully');
});
