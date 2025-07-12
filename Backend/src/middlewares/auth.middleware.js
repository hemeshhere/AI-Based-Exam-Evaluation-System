import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import Student from '../models/student.model.js';
import Teacher from '../models/teacher.model.js';

const verifyAsync = promisify(jwt.verify);

const roles = {
  STUDENT: 'student',
  TEACHER: 'teacher'
};

// Middleware to verify JWT and attach user info
const verifyToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = await verifyAsync(token, process.env.JWT_SECRET);

    // Attach user role and user data to request
    let user = null;
    if (decoded.role === roles.STUDENT) {
      user = await Student.findById(decoded.id).select('-password');
    } else if (decoded.role === roles.TEACHER) {
      user = await Teacher.findById(decoded.id).select('-password');
    }

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    req.role = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Role-based access middleware
const requireRole = (role) => (req, res, next) => {
  if (req.role !== role) {
    return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
  }
  next();
};

export {
  verifyToken,
  requireRole,
  roles
};