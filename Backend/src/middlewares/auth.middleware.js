import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import Student from '../models/student.model.js';
import Teacher from '../models/teacher.model.js';

const verifyAsync = promisify(jwt.verify);

const roles = {
  STUDENT: 'student',
  TEACHER: 'teacher'
};

const verifyToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = await verifyAsync(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}


