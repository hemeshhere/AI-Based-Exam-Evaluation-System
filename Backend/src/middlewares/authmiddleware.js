import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import Student from '../models/student.model.js';
import Teacher from '../models/teacher.model.js';

const verifyAsync = promisify(jwt.verify);

// Role constants
export const ROLES = {
  STUDENT: 'Student',
  TEACHER: 'Teacher'
};

// Middleware to verify JWT and attach user info
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      console.error('Authentication failed: No authorization header');
      return res.status(401).json({
        success: false,
        message: 'No authorization token provided'
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.error('Authentication failed: Malformed authorization header');
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization header format'
      });
    }

    let decoded;
    try {
      decoded = await verifyAsync(token, process.env.JWT_SECRET);
      console.log(`User ${decoded.id} authenticated (${decoded.role})`);
    } catch (jwtError) {
      console.error(`Token verification failed: ${jwtError.name} - ${jwtError.message}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        error: process.env.NODE_ENV === 'development' ? jwtError.message : undefined
      });
    }
    
    if (!decoded.role || !decoded.id) {
      console.error('Invalid token payload:', decoded);
      return res.status(401).json({
        success: false,
        message: 'Invalid token format'
      });
    }
    
    // Determine which model to use based on role
    let user = null;
    try {
      if (decoded.role === ROLES.STUDENT) {
        console.log('Looking up student with ID:', decoded.id);
        user = await Student.findById(decoded.id).select('-password');
      } else if (decoded.role === ROLES.TEACHER) {
        console.log('Looking up teacher with ID:', decoded.id);
        user = await Teacher.findById(decoded.id).select('-password');
      } else {
        console.error('Invalid role in token:', decoded.role);
        return res.status(401).json({
          success: false,
          message: 'Invalid user role in token'
        });
      }

      if (!user) {
        console.error('User not found with ID:', decoded.id);
        return res.status(401).json({
          success: false,
          message: 'User not found or inactive'
        });
      }

      // Update last login time if the field exists
      if (typeof user.lastLogin !== 'undefined') {
        console.log('Updating last login for user:', user._id);
        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });
      }

      // Attach user and role to request object
      req.user = user;
      req.role = decoded.role;
      console.log('User authenticated successfully:', { 
        id: user._id, 
        email: user.email, 
        role: decoded.role 
      });
      next();
    } catch (dbError) {
      console.error('Database error during authentication:', dbError);
      return res.status(500).json({
        success: false,
        message: 'Error during user lookup',
        error: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      });
    }
  } catch (error) {
    console.error('Unexpected authentication error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error during authentication',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Role-based access middleware
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.role || !roles.includes(req.role)) {
      return res.status(403).json({ 
        success: false,
        message: 'Forbidden: Insufficient permissions' 
      });
    }
    next();
  };
};

// Check if user is the owner of the resource
export const isOwner = (model, idField = '_id') => {
  return async (req, res, next) => {
    try {
      const doc = await model.findById(req.params[idField]);
      
      if (!doc) {
        return res.status(404).json({ 
          success: false,
          message: 'Resource not found' 
        });
      }

      if (doc.createdBy && doc.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ 
          success: false,
          message: 'Not authorized to access this resource' 
        });
      }

      req.doc = doc;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default verifyToken;