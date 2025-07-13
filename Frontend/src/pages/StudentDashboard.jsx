import React, { useState } from 'react';
import {
	User,
	LogOut,
	Calendar,
	AlertCircle,
	BookOpen,
	Award,
	FileText,
} from 'lucide-react';

import StudentProfile from './StudentProfile';
import StudentTimetable from './StudentTimetable';
import StudentExam from './StudentExam';
import StudentResult from './StudentResult';
import StudentIssue from './StudentIssue';

export default function StudentDashboard({ user, setUser }) {
	const [activeTab, setActiveTab] = useState('profile');

	const handleLogout = () => {
		setUser(null);
	};

	const sidebarItems = [
		{ id: 'profile', label: 'Profile', icon: User },
		{ id: 'timetable', label: 'Timetable', icon: Calendar },
		{ id: 'exam', label: 'Exam', icon: BookOpen },
		{ id: 'result', label: 'Result', icon: Award },
		{ id: 'issue', label: 'Raise Issue', icon: AlertCircle },
	];

	const renderContent = () => {
		switch (activeTab) {
			case 'profile':
				return <StudentProfile user={user} />;
			case 'timetable':
				return <StudentTimetable />;
			case 'exam':
				return <StudentExam />;
			case 'result':
				return <StudentResult />;
			case 'issue':
				return <StudentIssue />;
			default:
				return (
					<div className="p-6 flex items-center justify-center h-64">
						<div className="text-center">
							<div className="bg-gray-100 rounded-full p-6 mb-4 inline-block">
								<FileText className="w-12 h-12 text-gray-400" />
							</div>
							<h3 className="text-lg font-semibold text-gray-600 mb-2">
								Coming Soon
							</h3>
							<p className="text-gray-500">This section is under development.</p>
						</div>
					</div>
				);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white shadow-sm border-b border-gray-200 hidden md:block">
				<div className="flex items-center justify-between px-6 py-4">
					<div className="flex items-center space-x-3">
						<div className="bg-blue-100 p-2 rounded-full">
							<User className="w-6 h-6 text-blue-600" />
						</div>
						<div>
							<h1 className="text-lg font-semibold text-gray-800">
								{user?.name || 'John Doe'}
							</h1>
							<p className="text-sm text-gray-500">Student, Class 10th A</p>
						</div>
					</div>

					<button
						onClick={handleLogout}
						className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
					>
						<LogOut className="w-4 h-4" />
						<span>Logout</span>
					</button>
				</div>
			</div>

			<div className="flex">
				{/* Sidebar */}
				<aside className="w-64 bg-white shadow-lg hidden md:flex flex-col justify-between min-h-screen">
					<div className="p-6">
						<h1 className="text-2xl font-bold text-blue-600 mb-8">
							Student Portal
						</h1>
						<nav className="space-y-2">
							{sidebarItems.map((item) => {
								const Icon = item.icon;
								return (
									<button
										key={item.id}
										onClick={() => setActiveTab(item.id)}
										className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors duration-300
											${
												activeTab === item.id
													? 'bg-blue-50 text-blue-600 font-semibold border border-blue-200'
													: 'text-gray-700 font-medium hover:bg-blue-500 hover:text-white'
											}`}
									>
										<Icon className="w-6 h-6" />
										<span>{item.label}</span>
									</button>
								);
							})}
						</nav>
					</div>
				</aside>

				{/* Main Content */}
				<div className="flex-1 flex flex-col">
					<header className="bg-white shadow-md p-4 flex justify-between items-center md:hidden sticky top-0 z-10">
						<h1 className="text-xl font-bold text-blue-600">Student Portal</h1>
						<button className="p-2 rounded-md hover:bg-gray-100">
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M4 6h16M4 12h16M4 18h16"
								></path>
							</svg>
						</button>
					</header>

					<main className="flex-1 p-4 md:p-8 space-y-12">{renderContent()}</main>
				</div>
			</div>
		</div>
	);
}
