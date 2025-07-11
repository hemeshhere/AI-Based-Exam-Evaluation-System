import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../components/Login.jsx';
import TeacherDashboard from '../pages/TeacherDashboard.jsx';
import StudentDashboard from '../pages/StudentDashboard.jsx';

export default function AppRoutes() {
	const [user, setUser] = useState(null);

	return (
		<Routes>
			{/* <Route 
				path="/" 
				element={
					user ? 
						user.role === 'teacher' ? 
							<Navigate to="/teacher-dashboard" replace /> : 
							<Navigate to="/student-dashboard" replace />
						: <Navigate to="/login" replace />
				} 
			/> */}
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
			<Route 
				path="/teacher-dashboard" 
				element={
						<TeacherDashboard user={user} setUser={setUser} />
				} 
			/>
			<Route 
				path="/student-dashboard" 
				element={
						<StudentDashboard user={user} setUser={setUser} /> 
				} 
			/>
			{/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
		</Routes>
	);
}
