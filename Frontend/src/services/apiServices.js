import { apiClient, publicClient } from './api.js';
import { setToken } from '../utils/handleToken.js';

// --- Auth Services ---

export const login = async (credentials) => {
  const response = await publicClient.post('/api/v1/auth/login', credentials);
  if (response.data.data.token) {
    setToken({
      accessToken: response.data.data.token,
      refreshToken: response.data.data.refreshToken || null 
    });
  }
  return response.data;
};

export const registerStudent = async (studentData) => {
  const response = await publicClient.post('/api/v1/auth/register/student', studentData);
  if (response.data.data.token) {
    setToken({
      accessToken: response.data.data.token,
      refreshToken: response.data.data.refreshToken || null
    });
  }
  return response.data;
};

export const registerTeacher = async (teacherData) => {
  const response = await publicClient.post('/api/v1/auth/register/teacher', teacherData);
  if (response.data.data.token) {
    setToken({
      accessToken: response.data.data.token,
      refreshToken: response.data.data.refreshToken || null
    });
  }
  return response.data;
};

export const getMe = async () => {
    const response = await apiClient.get('/api/v1/auth/me');
    return response.data;
};

// --- Issue Services ---

export const createIssue = async (issueData) => {
    const response = await apiClient.post('/api/v1/issues', issueData);
    return response.data;
};

export const getStudentIssues = async () => {
    const response = await apiClient.get('/api/v1/issues/student');
    return response.data;
};

export const getTeacherIssues = async () => {
    const response = await apiClient.get('/api/v1/issues/teacher');
    return response.data;
};

export const replyToIssue = async (issueId, replyText) => {
    const response = await apiClient.put(`/api/v1/issues/${issueId}/reply`, { reply: replyText });
    return response.data;
};

export const createTimetableEntry = async (entryData) => {
  // We use the 'teacher/exams' route which is protected
  const response = await apiClient.post('/api/v1/teacher/exams', entryData);
  return response.data;
};

// This function is for the STUDENT to fetch their timetable
export const getStudentTimetable = async () => {
  const response = await apiClient.get('/api/v1/student/timetable');
  return response.data;
};
