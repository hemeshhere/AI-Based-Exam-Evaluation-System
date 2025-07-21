import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import {
    User,
    LogOut,
    Calendar,
    AlertCircle,
    BookOpen,
    Award,
    Menu,
    X,
} from 'lucide-react';

import StudentProfile from './StudentProfile';
import StudentTimetable from './StudentTimetable';
import StudentExam from './StudentExam';
import StudentResult from './StudentResult';
import StudentIssue from './StudentIssue';

export default function StudentDashboard({ user, setUser }) {
    const [activeTab, setActiveTab] = useState('profile');
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        setUser(null);
        navigate('/');
    };

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
        if (isSidebarOpen) {
            setSidebarOpen(false);
        }
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
            case 'profile': return <StudentProfile user={user} />;
            case 'timetable': return <StudentTimetable />;
            case 'exam': return <StudentExam />;
            case 'result': return <StudentResult />;
            case 'issue': return <StudentIssue />;
            default: return <div className="p-6 text-center text-gray-500">Select a section to begin.</div>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside
                className={`bg-white shadow-xl w-64 transform ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0 transition-transform duration-300 ease-in-out fixed md:relative h-full z-20 flex flex-col`}
            >
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-indigo-600">Student Portal</h1>
                </div>
                <nav className="px-4 flex-grow">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleTabClick(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 my-1 rounded-lg text-left transition-all duration-200 ${
                                    activeTab === item.id
                                        ? 'bg-indigo-600 text-white shadow-lg'
                                        : 'text-gray-600 font-medium hover:bg-indigo-50 hover:text-indigo-600'
                                }`}
                            >
                                <Icon className="w-6 h-6" />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
                <div className="p-4">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
                    >
                        <LogOut className="w-6 h-6" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                <header className="bg-white shadow-sm p-4 flex justify-between items-center md:hidden sticky top-0 z-10">
                    <h1 className="text-xl font-bold text-indigo-600">
                        {sidebarItems.find(i => i.id === activeTab)?.label}
                    </h1>
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 rounded-md hover:bg-gray-100">
                        {isSidebarOpen ? <X /> : <Menu />}
                    </button>
                </header>
                <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                    {renderContent()}
                </main>
                <Footer />
            </div>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-t-lg border-t flex justify-around p-1 z-10">
                {sidebarItems.map((item) => (
                    <button
                        key={`mobile-${item.id}`}
                        onClick={() => handleTabClick(item.id)}
                        className={`flex flex-col items-center p-2 rounded-lg w-full transition-colors ${
                            activeTab === item.id ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500'
                        }`}
                    >
                        <item.icon className="w-6 h-6 mb-1" />
                        <span className="text-xs">{item.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
}