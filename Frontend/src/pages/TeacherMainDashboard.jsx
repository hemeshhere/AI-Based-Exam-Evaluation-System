import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ClipboardList, BarChart, Users, PlusCircle, Calendar, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock data for demonstration purposes
const stats = [
    { label: 'Active Exams', value: 4, icon: ClipboardList, color: 'blue' },
    { label: 'Pending Submissions', value: 12, icon: Users, color: 'yellow' },
    { label: 'Graded This Week', value: 32, icon: BarChart, color: 'green' },
];

const recentActivity = [
    { student: 'Ashish Rai', action: 'submitted the Mid-Term Physics exam.', time: '10m ago' },
    { student: 'Jane Doe', action: 'submitted the Chemistry Lab Report.', time: '45m ago' },
    { student: 'John Smith', action: 'raised an issue regarding their profile.', time: '2h ago' },
];

const TeacherMainDashboard = () => {
    const { user } = useAuth();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    const colorClasses = {
        blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
        yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
        green: { bg: 'bg-green-100', text: 'text-green-600' },
        indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600' },
    };

    return (
        <motion.div 
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Welcome Header */}
            <motion.div variants={itemVariants}>
                <h2 className="text-3xl font-bold text-gray-800">Welcome back, Prof. {user?.lastName}!</h2>
                <p className="text-gray-500 mt-1">Here's a summary of your teaching activities today.</p>
            </motion.div>

            {/* Stats Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className={`bg-white rounded-xl shadow-lg p-6 flex items-center gap-6 border border-gray-200`}>
                        <div className={`p-4 rounded-full ${colorClasses[stat.color].bg}`}>
                            <stat.icon className={`w-8 h-8 ${colorClasses[stat.color].text}`} />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Quick Actions */}
                <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
                     <h3 className="text-xl font-bold text-gray-700">Quick Actions</h3>
                     <div className="space-y-4">
                        <ActionCard icon={PlusCircle} title="Create New Exam" description="Design and publish a new test." />
                        <ActionCard icon={Calendar} title="Schedule Timetable" description="Set dates for upcoming exams." />
                     </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-700 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50">
                                <div className="p-2 bg-gray-100 rounded-full mt-1">
                                    <Bell className="w-5 h-5 text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-800">
                                        <span className="font-semibold">{activity.student}</span> {activity.action}
                                    </p>
                                    <p className="text-xs text-gray-400">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

const ActionCard = ({ icon: Icon, title, description }) => (
    <motion.button 
        className="w-full bg-white rounded-xl shadow-lg p-6 text-left flex items-center gap-6 border border-gray-200 hover:border-indigo-500 hover:shadow-xl transition-all"
        whileHover={{ y: -5 }}
    >
        <div className="p-4 bg-indigo-100 text-indigo-600 rounded-full">
            <Icon className="w-8 h-8" />
        </div>
        <div>
            <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
    </motion.button>
);

export default TeacherMainDashboard;
