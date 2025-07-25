import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; // ✅ Import the useAuth hook

// Import Components and Pages
import RoleSelector from '../components/RoleSelector';
import StudentLogin from '../components/StudentLogin.jsx';
import TeacherLogin from '../components/TeacherLogin.jsx';
import StudentDashboard from '../pages/StudentDashboard.jsx';
import TeacherDashboard from '../pages/TeacherDashboard.jsx';
import Login from '../components/Login.jsx';

// A component to protect routes
const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated || user.role !== role) {
    // If not authenticated or role doesn't match, redirect to landing
    return <Navigate to="/" replace />;
  }
  return children;
};

export default function AppRoutes() {
  const { isAuthenticated, user } = useAuth(); // ✅ Get user state from context

  return (
    <Routes>
      {/* --- Public Routes --- */}
      <Route 
        path="/" 
        element={
          !isAuthenticated ? <RoleSelector /> : 
          <Navigate to={user.role === 'student' ? '/student-dashboard' : '/teacher-dashboard'} replace />
        }
      />
      <Route 
        path="/student-login" 
        element={!isAuthenticated ? <StudentLogin /> : <Navigate to="/student-dashboard" replace />}
      />
      <Route 
        path="/teacher-login" 
        element={!isAuthenticated ? <TeacherLogin /> : <Navigate to="/teacher-dashboard" replace />}
      />
      
      {/* The generic /login route can now be a modal triggered from RoleSelector */}
      {/* For simplicity, we'll keep the separate student/teacher login pages */}
      <Route path="/login" element={<Login />} />

      {/* --- Protected Routes --- */}
      <Route
        path="/student-dashboard"
        element={
          <ProtectedRoute role="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher-dashboard"
        element={
          <ProtectedRoute role="teacher">
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />

      {/* --- Fallback Route --- */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}