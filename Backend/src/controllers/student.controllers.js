import Student from '../models/student.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import jwt from 'jsonwebtoken';

// Generate tokens function
const generateTokens = asyncHandler(async (req, res) => {
    const { studentId } = req.body;

    if (!studentId) {
        throw new ApiError(400, 'Student ID is required');
    }

    const student = await Student.findById(studentId);
    if (!student) {
        throw new ApiError(404, 'Student not found');
    }

    // Generate tokens
    const accessToken = jwt.sign({ id: student._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
    const refreshToken = jwt.sign({ id: student._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });

    return res
    .status(200)
    .json(
        new ApiResponse('Tokens generated successfully', { accessToken, refreshToken })
    );
});

// Register student
const registerStudent = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new ApiError(400, 'Name, email, and password are required');
    }

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
        throw new ApiError(409, 'Student with this email already exists');
    }

    const student = new Student({ name, email, password });
    await student.save();

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                'Student registered successfully',
                { student }
            )
        );
});

// Login student
const loginStudent = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, 'Email and password are required');
    }

    const student = await Student.findOne({ email });
    if (!student || !(await student.comparePassword(password))) {
        throw new ApiError(401, 'Invalid email or password');
    }

    const accessToken = jwt.sign({ id: student._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
    const refreshToken = jwt.sign({ id: student._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                'Login successful',
                { accessToken, refreshToken }
            )
        );
});

// Logout student
const logoutStudent = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        throw new ApiError(400, 'Refresh token is required');
    }

    // Here you would typically invalidate the refresh token in your database or cache
    // For this example, we will just return a success message
    // In a real application, you would also handle token revocation

    return res
        .status(200)
        .json(
            new ApiResponse('Logout successful')
        );
});

// Get current user profile
const getCurrentUserProfile = asyncHandler(async (req, res) => {
    const studentId = req.user.id;

    const student = await Student.findById(studentId).select('-password');
    if (!student) {
        throw new ApiError(404, 'Student not found');
    }

    return res
        .status(200)
        .json(
            new ApiResponse('User profile retrieved successfully', { student })
        );
});

// Update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
    const studentId = req.user.id;
    const { name, email } = req.body;

    if (!name || !email) {
        throw new ApiError(400, 'Name and email are required');
    }

    const student = await Student.findByIdAndUpdate(
        studentId,
        { name, email },
        { new: true, runValidators: true }
    ).select('-password');

    if (!student) {
        throw new ApiError(404, 'Student not found');
    }

    return res
        .status(200)
        .json(
            new ApiResponse('User profile updated successfully', { student })
        );
});

// Get user by ID
const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const student = await Student.findById(id).select('-password');
    if (!student) {
        throw new ApiError(404, 'Student not found');
    }

    return res
        .status(200)
        .json(
            new ApiResponse('User retrieved successfully', { student })
        );
});

// Get all students
const getAllStudents = asyncHandler(async (req, res) => {
    const students = await Student.find().select('-password');
    return res
        .status(200)
        .json(
            new ApiResponse('All students retrieved successfully', { students })
        );
});

// Delete student
const deleteStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const student = await Student.findByIdAndDelete(id);
    if (!student) {
        throw new ApiError(404, 'Student not found');
    }

    return res
        .status(200)
        .json(
            new ApiResponse('Student deleted successfully')
        );
});

export {
    generateTokens,
    registerStudent,
    loginStudent,
    logoutStudent,
    getCurrentUserProfile,
    updateUserProfile,
    getUserById,
    getAllStudents,
    deleteStudent
};
