import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import Exam from '../models/exam.model.js';

export const createExam = asyncHandler(async (req, res) => {
  const requiredFields = [
    'title', 'description', 'date', 'startTime', 'endTime',
    'durationMinutes', 'year', 'semester', 'batch',
    'section', 'department'
  ];

  const missingFields = requiredFields.filter(field => !req.body[field]);

  if (missingFields.length > 0) {
    throw ApiError.BadRequest(`Missing required fields: ${missingFields.join(', ')}`);
  }

  // Convert incoming ISO strings to real JS Date objects
  const startTime = new Date(req.body.startTime);
  const endTime = new Date(req.body.endTime);
  const date = new Date(req.body.date);

  if (isNaN(startTime) || isNaN(endTime) || isNaN(date)) {
    throw ApiError.BadRequest('Invalid date format');
  }

  const exam = new Exam({
    ...req.body,
    startTime,
    endTime,
    date,
    createdBy: req.user?._id
  });

  await exam.save();

  return new ApiResponse(res).success(exam, 'Exam created successfully');
});
