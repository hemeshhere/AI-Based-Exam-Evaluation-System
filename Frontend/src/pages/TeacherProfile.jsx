import React from 'react';
import { User, Mail, Shield } from 'lucide-react';

const TeacherProfile = ({ user }) => {
  const name = user?.name || 'John Doe';
  const email = user?.email || 'teacher@example.com';
  const role = user?.role || 'teacher';

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="w-full p-6 md:p-10 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">👤 My Profile</h2>

        <div className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-10 transition-all duration-300">
          {/* Avatar */}
          <div className="flex items-center space-x-6 w-full md:w-1/3">
            <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow-md hover:scale-105 transition-transform">
              {initials}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
              <p className="text-gray-500 text-sm capitalize mt-1">{role}</p>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-4 w-full md:w-2/3">
            <div className="flex items-center text-gray-700">
              <User className="mr-3 text-blue-500" size={20} />
              <span className="font-medium">
                <span className="text-gray-500 font-normal">Name:</span> {name}
              </span>
            </div>

            <div className="flex items-center text-gray-700">
              <Mail className="mr-3 text-blue-500" size={20} />
              <span className="font-medium">
                <span className="text-gray-500 font-normal">Email:</span> {email}
              </span>
            </div>

            <div className="flex items-center text-gray-700">
              <Shield className="mr-3 text-blue-500" size={20} />
              <span className="font-medium">
                <span className="text-gray-500 font-normal">Role:</span> {role}
              </span>
            </div>

            <div className="text-right mt-4">
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition duration-300">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
