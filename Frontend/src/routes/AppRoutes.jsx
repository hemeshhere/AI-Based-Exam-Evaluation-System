import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from '../components/Login.jsx';
import RoleSelector from '../components/RoleSelector';
import StudentLogin from '../components/StudentLogin.jsx';
import TeacherLogin from '../components/TeacherLogin.jsx';
import StudentDashboard from '../pages/StudentDashboard.jsx';
import TeacherDashboard from '../pages/TeacherDashboard.jsx'; // ✅ Add these two

export default function AppRoutes() {
  const [user, setUser] = useState(null);

  return (
    <Routes>
      {/* Homepage: Role Selection */}
      <Route path="/" element={<RoleSelector />} />

      {/* Student and Teacher Separate Login Pages */}
      <Route path="/student-login" element={<StudentLogin />} />
      <Route path="/teacher-login" element={<TeacherLogin />} />

      {/* Shared Login with role-based redirection */}
      <Route
        path="/login"
        element={
          user ? (
            user.role === 'teacher' ? (
              <Navigate to="/teacher-dashboard" replace />
            ) : (
              <Navigate to="/student-dashboard" replace />
            )
          ) : (
            <Login setUser={setUser} showModal={true} setShowModal={() => {}} />
          )
        }
      />

      {/* Protected Teacher Dashboard */}
      <Route
        path="/teacher-dashboard"
        element={
          user?.role === 'teacher' ? (
            <TeacherDashboard user={user} setUser={setUser} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Protected Student Dashboard */}
      <Route
        path="/student-dashboard"
        element={
          user?.role === 'student' ? (
            <StudentDashboard user={user} setUser={setUser} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Catch-all Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
