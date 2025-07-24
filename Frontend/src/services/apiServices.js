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

export const isAuthenticated = () => {
  const { accessToken } = getToken();
  return !!accessToken;
};

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