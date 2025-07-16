import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';
import Student from '../models/student.model.js';
import Teacher from '../models/teacher.model.js';
import { ROLES } from '../middlewares/authMiddleware.js';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('❌ Fatal Error: JWT_SECRET is not defined in environment variables');
  process.exit(1);
}

// Helper function to generate JWT token
const generateToken = (user, role) => {
  try {
    return jwt.sign(
      { 
        id: user._id,
        email: user.email,
        role: role
      }, 
      JWT_SECRET, 
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
    phoneNumber,
    gender,
    dateOfBirth,
    department,
    year,
    section,
    semester,
    address
  } = req.body;
  
  console.log(`New student registration attempt: ${email} (RegID: ${registrationID}, Roll: ${rollNumber})`);
  
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
    if (existingStudent.email === email.toLowerCase()) {
      console.error(`Registration failed: Email ${email} already in use`);
      throw ApiError.BadRequest('Email already in use');
    }
    if (existingStudent.rollNumber === rollNumber.toUpperCase()) {
      console.error(`Registration failed: Roll number ${rollNumber} already in use`);
      throw ApiError.BadRequest('Roll number already in use');
    }
    if (existingStudent.registrationID === registrationID) {
      console.error(`Registration failed: Registration ID ${registrationID} already in use`);
      throw ApiError.BadRequest('Registration ID already in use');
    }
  }

  // Create new student
  const student = await Student.create({
    email: email.toLowerCase(),
    password,
    firstName,
    lastName,
    rollNumber: rollNumber.toUpperCase(),
    registrationID,
    phoneNumber: phoneNumber || '',
    gender: gender || 'prefer-not-to-say',
    dateOfBirth: dateOfBirth || null,
    department: department || 'Not Specified',
    year: year || '1',
    section: section?.toUpperCase() || 'A',
    semester: semester || '1',
    address: {
      street: address.street || 'Not Specified',
      city: address.city || 'Not Specified',
      state: address.state || 'Not Specified',
      postalCode: address.postalCode || '000000',
      country: address.country || 'Not Specified'
    }
  });

  // Generate JWT token
  const token = generateToken(student, ROLES.STUDENT);

  // Return response without password
  const studentResponse = student.toObject();
  delete studentResponse.password;
  
  new ApiResponse(res).success(
    { user: { ...studentResponse, role: ROLES.STUDENT }, token },
    'Student registration successful',
    201
  );
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
  
  new ApiResponse(res).success(
    { user: { ...teacherResponse, role: ROLES.TEACHER }, token },
    'Teacher registration successful',
    201
  );
});

// Login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  // Log only the email (no password)
  console.log(`Login attempt for email: ${email}`);

  // Validate input
  if (!email || !password) {
    console.error('Login failed: Missing credentials');
    throw ApiError.BadRequest('Email and password are required');
  }

  let user = null;
  let userRole = null;
  
  // Find user in both collections
  try {
    // Try to find as student first
    user = await Student.findOne({ email }).select('+password');
    if (user) {
      userRole = ROLES.STUDENT;
    } 
    // If not found as student, try as teacher
    if (!user) {
      user = await Teacher.findOne({ email }).select('+password');
      if (user) {
        userRole = ROLES.TEACHER;
      }
    }
    
    // If still not found, throw error
    if (!user) {
      console.log('No user found with email:', email);
      throw ApiError.Unauthorized('Invalid email or password');
    }
  } catch (error) {
    console.error('Error during user lookup:', error);
    throw ApiError.InternalServerError('Error during authentication');
  }
  
  // Check if user exists and password is correct
  if (!user) {
    console.error('No user found with email:', email);
    throw ApiError.Unauthorized('Invalid email or password');
  }

  console.log('User found, comparing password...');
  const isPasswordValid = await user.comparePassword(password).catch(err => {
    console.error('Error comparing passwords:', err);
    return false;
  });

  if (!isPasswordValid) {
    console.error('Invalid password for user:', email);
    throw ApiError.Unauthorized('Invalid email or password');
  }

  // Generate JWT token
  let token;
  try {
    token = generateToken(user, userRole);
    console.log(`User ${user._id} (${userRole}) logged in successfully`);
  } catch (tokenError) {
    console.error('Token generation failed:', tokenError.message);
    throw ApiError.InternalServerError('Authentication error');
  }

  // Return response without password
  const userData = user.toObject();
  delete userData.password;
  
  new ApiResponse(res).success(
    { 
      user: { 
        ...userData, 
        role: userRole 
      }, 
      token 
    },
    'Login successful'
  );
});

// Get current user
export const getMe = asyncHandler(async (req, res) => {
  const { user, role } = req;
  
  // Get fresh user data
  let userData;
  if (role === ROLES.STUDENT) {
    userData = await Student.findById(user._id).select('-password');
  } else if (role === ROLES.TEACHER) {
    userData = await Teacher.findById(user._id).select('-password');
  }

  if (!userData) {
    throw ApiError.NotFound('User not found');
  }

  new ApiResponse(res).success(
    { user: { ...userData.toObject(), role } },
    'User data retrieved successfully'
  );
});
