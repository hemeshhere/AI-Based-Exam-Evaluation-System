import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';
import Student from '../models/student.model.js';
import Teacher from '../models/teacher.model.js';
import { ROLES } from '../middlewares/authmiddleware.js';

// Helper function to generate JWT token
const generateToken = (user, role) => {
  try {
    // Validate role
    if (!Object.values(ROLES).includes(role)) {
      throw new Error(`Invalid role: ${role}`);
    }
    
    return jwt.sign(
      { 
        id: user._id,
        email: user.email,
        role: role
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error('Failed to generate authentication token');
  }
};

// Student Registration
export const registerStudent = asyncHandler(async (req, res) => {
  const { 
    email, 
    password, 
    firstName, 
    lastName, 
    rollNumber, 
    registrationID,
    phoneNumber = '',
    gender = 'prefer-not-to-say',
    dateOfBirth = null,
    department = 'Not Specified',
    year = '1',
    section = 'A',
    semester = '1',
    address = {
      street: 'Not Specified',
      city: 'Not Specified',
      state: 'Not Specified',
      postalCode: '000000',
      country: 'Not Specified'
    }
  } = req.body;

  const requiredFields = ['email', 'password', 'firstName', 'lastName', 'rollNumber', 'registrationID'];
  const missingFields = requiredFields.filter(field => !req.body[field]);
  
  if (missingFields.length > 0) {
    throw ApiError.BadRequest(`Missing required fields: ${missingFields.join(', ')}`);
  }

  // Check if student already exists
  const existingStudent = await Student.findOne({ 
    $or: [
      { email: email.toLowerCase() },
      { rollNumber: rollNumber.toUpperCase() },
      { registrationID }
    ]
  });
  
  if (existingStudent) {
    const conflictField = existingStudent.email === email.toLowerCase() ? 'email' :
                         existingStudent.rollNumber === rollNumber.toUpperCase() ? 'rollNumber' : 'registrationID';
    throw ApiError.BadRequest(`${conflictField} already in use`);
  }

  // Create new student
  const student = await Student.create({
    email: email.toLowerCase(),
    password,
    firstName,
    lastName,
    rollNumber: rollNumber.toUpperCase(),
    registrationID,
    phoneNumber,
    gender,
    dateOfBirth,
    department,
    year,
    section: section.toUpperCase(),
    semester,
    address
  });

  // Generate JWT token
  const token = generateToken(student, ROLES.STUDENT);

  // Return response without password
  const studentResponse = student.toObject();
  delete studentResponse.password;
  
  const response = new ApiResponse(res);
  response.success(201, { 
    user: { ...studentResponse, role: ROLES.STUDENT }, 
    token 
  }, 'Student registration successful');
});

// Teacher Registration
export const registerTeacher = asyncHandler(async (req, res) => {
  console.log('Teacher registration request received:', JSON.stringify(req.body, null, 2));
  const { 
    email, 
    password, 
    firstName, 
    lastName,
    employeeID,
    title,
    department,
    experienceYears,
    specialization = [],
    phoneNumber,
    gender,
    dateOfBirth,
    address = {}
  } = req.body;
  
  // Validate required fields
  if (!email || !password || !firstName || !lastName || !employeeID || !title || !department || experienceYears === undefined) {
    throw ApiError.BadRequest('All required fields must be provided');
  }

  // Check if teacher already exists
  const existingTeacher = await Teacher.findOne({ 
    $or: [
      { email: email.toLowerCase() },
      { employeeID: employeeID.toUpperCase() }
    ]
  });
  
  if (existingTeacher) {
    throw ApiError.BadRequest('Email or Employee ID already in use');
  }

  // Create new teacher
  const teacher = await Teacher.create({
    email: email.toLowerCase(),
    password,
    firstName,
    lastName,
    employeeID: employeeID.toUpperCase(),
    title,
    department,
    experienceYears: Number(experienceYears),
    specialization: Array.isArray(specialization) ? specialization : [specialization],
    phoneNumber,
    gender: gender || 'prefer-not-to-say',
    dateOfBirth,
    address: {
      street: address.street || 'Not Specified',
      city: address.city || 'Not Specified',
      state: address.state || 'Not Specified',
      postalCode: address.postalCode || '000000',
      country: address.country || 'Not Specified'
    }
  });

  // Generate JWT token
  const token = generateToken(teacher, ROLES.TEACHER);

  // Return response without password
  const teacherResponse = teacher.toObject();
  delete teacherResponse.password;
  
  const response = new ApiResponse(res);
  response.success(201, { 
    user: { ...teacherResponse, role: ROLES.TEACHER }, 
    token 
  }, 'Teacher registration successful');
});

// Login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  // Find user in both collections
  let user = await Student.findOne({ email }).select('+password');
  let userRole = 'student';

  if (!user) {
    user = await Teacher.findOne({ email }).select('+password');
    userRole = 'teacher';
  }

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = generateToken(user, userRole === 'student' ? ROLES.STUDENT : ROLES.TEACHER);
  
  // Convert user to plain object and remove password
  const userObj = user.toObject();
  delete userObj.password;

  // Add role to user object
  userObj.role = userRole;

  // Send response
  return res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: userObj,
      token: token
    }
  });
});

// Get current user
export const getMe = asyncHandler(async (req, res) => {
  const user = req.user;
  const role = req.role;
  
  // Convert to plain object and remove password
  const userObj = user.toObject();
  delete userObj.password;
  
  // Add role to user object
  userObj.role = role;

  // Send response
  return res.status(200).json({
    success: true,
    message: 'User data retrieved successfully',
    data: { user: userObj }
  });
});
