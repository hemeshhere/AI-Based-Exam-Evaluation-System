import React from 'react';

const TeacherProfile = ({ user }) => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
    <div className="bg-white p-6 rounded-lg shadow border space-y-4">
      <p><strong>Name:</strong> {user?.name || 'John Doe'}</p>
      <p><strong>Email:</strong> {user?.email || 'teacher@example.com'}</p>
      <p><strong>Role:</strong> {user?.role || 'Teacher'}</p>
    </div>
  </div>
);

export default TeacherProfile;
