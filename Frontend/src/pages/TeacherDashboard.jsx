import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import {
  User,
  LogOut,
  BarChart3,
  Home,
  FileText,
  Calendar,
  AlertCircle,
  Settings,
} from 'lucide-react';

import TeacherStatistics from './TeacherStatistics';
import TeacherMainDashboard from './TeacherMainDashboard';
import TeacherExam from './TeacherExam';
import TeacherTimetable from './TeacherTimetable';
import TeacherIssue from './TeacherIssue';
import TeacherProfile from './TeacherProfile';

const TeacherDashboard = ({ user, setUser }) => {
  const [activeTab, setActiveTab] = useState('statistics');
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
	{ id: 'statistics', label: 'Statistics', icon: BarChart3 },
    { id: 'exam', label: 'Exam', icon: FileText },
    { id: 'timetable', label: 'Timetable', icon: Calendar },
    { id: 'issue', label: 'Issue', icon: AlertCircle },
    { id: 'profile', label: 'Profile', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'statistics':
        return <TeacherStatistics />;
      case 'dashboard':
        return <TeacherMainDashboard />;
      case 'exam':
        return <TeacherExam />;
      case 'timetable':
        return <TeacherTimetable />;
      case 'issue':
        return <TeacherIssue />;
      case 'profile':
        return <TeacherProfile user={user} />;
      default:
        return (
          <div className="p-6 flex items-center justify-center h-64">
            <div className="text-center">
              <div className="bg-gray-100 rounded-full p-6 mb-4 inline-block">
                <FileText className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Coming Soon</h3>
              <p className="text-gray-500">This section is under development.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">{user?.name || 'John Doe'}</h1>
              <p className="text-sm text-gray-500">Teacher</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Sidebar + Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm border-r border-gray-200 h-[calc(100vh-72px)] p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Navigation</h2>
          <nav className="flex flex-col gap-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center px-4 py-3 rounded-lg text-left transition-all duration-200 font-medium gap-3
                    ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">{renderContent()}</main>
      </div>
        <Footer />
    </div>
  );
};

export default TeacherDashboard;
