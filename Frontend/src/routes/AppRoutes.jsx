import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../components/Login.jsx';
import TeacherDashboard from '../pages/TeacherDashboard.jsx';
import StudentDashboard from '../pages/StudentDashboard.jsx';
import RoleSelector from '../components/RoleSelector';



export default function AppRoutes() {
	const [user, setUser] = useState(null);

	return (
		<Routes>
			{/* Role Selector as Homepage */}
			<Route path="/" element={<RoleSelector />} />

			{/* Login Route */}
			<Route
				path="/login"
				element={
					user ?
						user.role === 'teacher' ?
							<Navigate to="/teacher-dashboard" replace /> :
							<Navigate to="/student-dashboard" replace />
						: <Login setUser={setUser} />
				}
			/>

			{/* Teacher Dashboard */}
			<Route
				path="/teacher-dashboard"
				element={
					user?.role === 'teacher' ?
						<TeacherDashboard user={user} setUser={setUser} />
						: <Navigate to="/login" replace />
				}
			/>

			{/* Student Dashboard */}
			<Route
				path="/student-dashboard"
				element={
					user?.role === 'student' ?
						<StudentDashboard user={user} setUser={setUser} />
						: <Navigate to="/login" replace />
				}
			/>

			{/* Catch-all route */}
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>

	);
}
