import React from 'react';
import { ClipboardList, BarChart, Users } from 'lucide-react';

const TeacherMainDashboard = () => {
  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-white min-h-screen">
      <h2 className="text-3xl font-bold text-blue-800 mb-6">📘 Teacher Dashboard</h2>
      
      <p className="text-gray-700 mb-8 text-lg">
        Manage exams, monitor student progress, and streamline your teaching workflow.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition-all">
          <ClipboardList className="text-blue-600 mb-2" size={28} />
          <h3 className="text-xl font-semibold text-gray-800">Create New Exam</h3>
          <p className="text-gray-600 text-sm mt-1">Set up and publish new test papers.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition-all">
          <BarChart className="text-green-600 mb-2" size={28} />
          <h3 className="text-xl font-semibold text-gray-800">Student Progress</h3>
          <p className="text-gray-600 text-sm mt-1">Review performance and insights.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition-all">
          <Users className="text-purple-600 mb-2" size={28} />
          <h3 className="text-xl font-semibold text-gray-800">Manage Students</h3>
          <p className="text-gray-600 text-sm mt-1">Update student data and track status.</p>
        </div>
      </div>
    </div>
  );
};

export default TeacherMainDashboard;
