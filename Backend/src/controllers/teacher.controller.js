import Teacher from "../models/teacher.model";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

// Generate tokens function
const generateTokens = asyncHandler(async (req, res) => {
    const { teacherId } = req.body;

    if (!teacherId) {
        throw new ApiError(400, 'Teacher ID is required');
    }

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
        throw new ApiError(404, 'Teacher not found');
    }

    // Generate tokens
    const accessToken = jwt.sign({ id: teacher._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
    const refreshToken = jwt.sign({ id: teacher._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });

    return res
        .status(200)
        .json(
            new ApiResponse('Tokens generated successfully', { accessToken, refreshToken })
        );
});

// Register teacher
const registerTeacher = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new ApiError(400, 'Name, email, and password are required');
    }

    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
        throw new ApiError(409, 'Teacher with this email already exists');
    }

    const teacher = new Teacher({ name, email, password });
    await teacher.save();

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                'Teacher registered successfully',
                { teacher }
            )
        );
});

// Login teacher
const loginTeacher = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, 'Email and password are required');
    }

    const teacher = await Teacher.findOne({ email });
    if (!teacher || !(await teacher.comparePassword(password))) {
        throw new ApiError(401, 'Invalid email or password');
    }

    // Generate tokens
    const accessToken = jwt.sign({ id: teacher._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
    const refreshToken = jwt.sign({ id: teacher._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });

    return res
        .status(200)
        .json(
            new ApiResponse('Login successful', { accessToken, refreshToken })
        );
});

// Logout teacher
const logoutTeacher = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        throw new ApiError(400, 'Refresh token is required');
    }

    // Invalidate the refresh token (implementation depends on your strategy)
    // For example, you might store it in a blacklist or remove it from a database

    return res
        .status(200)
        .json(
            new ApiResponse('Logout successful')
        );
});

// Get current teacher profile
const getCurrentTeacherProfile = asyncHandler(async (req, res) => {
    const teacher = await Teacher.findById(req.user.id).select('-password');
    if (!teacher) {
        throw new ApiError(404, 'Teacher not found');
    }

    return res
        .status(200)
        .json(
            new ApiResponse('Current teacher profile retrieved successfully', { teacher })
        );
});

// Update teacher profile
const updateTeacherProfile = asyncHandler(async (req, res) => {
    const teacher = await Teacher.findById(req.user.id).select('-password');
    if (!teacher) {
        throw new ApiError(404, 'Teacher not found');
    }

    const { name, email } = req.body;
    if (!name || !email) {
        throw new ApiError(400, 'Name and email are required');
    }

    teacher.name = name;
    teacher.email = email;
    await teacher.save();

    return res
        .status(200)
        .json(
            new ApiResponse('Teacher profile updated successfully', { teacher })
        );
});

// Get teacher by ID
const getTeacherById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const teacher = await Teacher.findById(id).select('-password');
    if (!teacher) {
        throw new ApiError(404, 'Teacher not found');
    }

    return res
        .status(200)
        .json(
            new ApiResponse('Teacher profile retrieved successfully', { teacher })
        );
});

// Get all teachers
const getAllTeachers = asyncHandler(async (req, res) => {
    const teachers = await Teacher.find().select('-password');
    return res
        .status(200)
        .json(
            new ApiResponse('All teachers retrieved successfully', { teachers })
        );
});

// Delete teacher
const deleteTeacher = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const teacher = await Teacher.findByIdAndDelete(id);
    if (!teacher) {
        throw new ApiError(404, 'Teacher not found');
    }

    return res
        .status(200)
        .json(
            new ApiResponse('Teacher deleted successfully', { teacher })
        );
});

export {
    generateTokens,
    registerTeacher,
    loginTeacher,
    logoutTeacher,
    getCurrentTeacherProfile,
    updateTeacherProfile,
    getTeacherById,
    getAllTeachers,
    deleteTeacher
};