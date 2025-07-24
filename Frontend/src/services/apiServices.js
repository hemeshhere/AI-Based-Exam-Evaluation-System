import { apiClient, publicClient } from './api.js';
import { setToken, getToken, removeToken } from '../utils/handleTokens.js';

// Function to handle authentication errors globally
const handleAuthError = error => {
  if (error.response && error.response.status === 401) {
    removeToken();
    window.location.href = '/login';
  }
  return Promise.reject(error);
};

// Auth APIs
export const registerStudent = async studentData => {
  try {
    const response = await publicClient.post('/api/v1/auth/register/student', studentData);
    return response.data;
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
};

export const registerTeacher = async teacherData => {
  try {
    const response = await publicClient.post('/api/v1/auth/register/teacher', teacherData);
    return response.data;
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
};

export const login = async credentials => {
  try {
    const response = await publicClient.post('/api/v1/auth/login', credentials);
    setToken(response.data);
    return response.data;
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
};

// Student APIs
export const getActiveExams = async () => {
  try {
    const response = await apiClient.get('/api/v1/student/exams/active');
    return response.data;
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
};

export const startExam = async (examId) => {
  try {
    const response = await apiClient.post(`/api/v1/student/exams/${examId}/start`);
    return response.data;
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
};

export const submitExam = async (submissionId, answers) => {
  try {
    const response = await apiClient.put(`/api/v1/student/submissions/${submissionId}/submit`, { answers });
    return response.data;
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
};

export const getExamResult = async (submissionId) => {
  try {
    const response = await apiClient.get(`/api/v1/student/results/${submissionId}`);
    return response.data;
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
};

// Teacher APIs
export const createExam = async (examData) => {
  try {
    const response = await apiClient.post('/api/v1/teacher/exams', examData);
    return response.data;
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
};

export const updateExam = async (examId, examData) => {
  try {
    const response = await apiClient.put(`/api/v1/teacher/exams/${examId}`, examData);
    return response.data;
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
};

export const getTeacherExams = async () => {
  try {
    const response = await apiClient.get('/api/v1/teacher/exams');
    return response.data;
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
};

export const getExamSubmissions = async (examId) => {
  try {
    const response = await apiClient.get(`/api/v1/teacher/exams/${examId}/submissions`);
    return response.data;
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
};

export const gradeSubmission = async (submissionId, gradeData) => {
  try {
    const response = await apiClient.put(`/api/v1/teacher/submissions/${submissionId}/grade`, gradeData);
    return response.data;
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
};

export const publishResults = async (examId) => {
  try {
    const response = await apiClient.post(`/api/v1/teacher/exams/${examId}/publish-results`);
    return response.data;
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
};