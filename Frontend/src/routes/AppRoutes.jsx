import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from '../components/Login.jsx';
import RoleSelector from '../components/RoleSelector';
import StudentLogin from '../components/StudentLogin.jsx';
import TeacherLogin from '../components/TeacherLogin.jsx';
import StudentDashboard from '../pages/StudentDashboard.jsx';
import TeacherDashboard from '../pages/TeacherDashboard.jsx';

export default function AppRoutes({ user, setUser }) {
  return (
    <Routes>
      <Route path="/" element={<RoleSelector user={user} setUser={setUser} />} />

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

      {/* ✅ New routes for separate student and teacher login pages */}
      <Route
        path="/student-login"
        element={
          user?.role === 'student' ? (
            <Navigate to="/student-dashboard" replace />
          ) : (
            <StudentLogin setUser={setUser} />
          )
        }
      />
      <Route
        path="/teacher-login"
        element={
          user?.role === 'teacher' ? (
            <Navigate to="/teacher-dashboard" replace />
          ) : (
            <TeacherLogin setUser={setUser} />
          )
        }
      />

      <Route
        path="/teacher-dashboard"
        element={
          user?.role === 'teacher' ? (
            <TeacherDashboard user={user}  setUser={setUser}/>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route
        path="/student-dashboard"
        element={
          user?.role === 'student' ? (
            <StudentDashboard user={user}  setUser={setUser} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
