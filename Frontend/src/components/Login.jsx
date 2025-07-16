// 🔄 Updated Login.jsx with modal functionality and blurred background
import React, { useState, useEffect } from 'react';
import studentImage from '../assets/student.jpg';
import teacherImage from '../assets/teacher.jpg';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

export default function Login({ showModal, setShowModal, setUser }) {
  const [role, setRole] = useState('student');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = showModal ? 'hidden' : 'auto';
  }, [showModal]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser({ name: form.name, email: form.email, role: role });
    navigate(role === 'student' ? '/student-dashboard' : '/teacher-dashboard');
    setShowModal(false);
  };

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex overflow-hidden relative"
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-gray-600 text-2xl hover:text-red-500"
            >
              &times;
            </button>

            {/* Image Section */}
            <div className="w-1/2 hidden md:block relative">
              <AnimatePresence mode="wait">
                <motion.img
                  key={role}
                  src={role === 'student' ? studentImage : teacherImage}
                  alt={role}
                  initial={{ opacity: 0, scale: 0.95, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95, x: 20 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full object-cover rounded-l-2xl"
                />
              </AnimatePresence>
              <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/40 to-transparent text-white text-xl font-semibold text-center py-2 z-10">
                {role === 'student' ? 'Hello Student 👨‍🎓' : 'Welcome Teacher 👩‍🏫'}
              </div>
            </div>

            {/* Form Section */}
            <div className="w-full md:w-1/2 bg-white p-10 flex flex-col items-center justify-center">
              <h2 className="text-3xl font-bold text-blue-600 text-center mb-6">Sign In</h2>
              <form onSubmit={handleSubmit} className="w-full space-y-5">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <div className="flex gap-6 justify-center mt-2 text-sm text-gray-600">
                  <label htmlFor="student" className="flex items-center gap-2 cursor-pointer hover:text-blue-500">
                    <input
                      id="student"
                      type="radio"
                      value="student"
                      checked={role === 'student'}
                      onChange={() => setRole('student')}
                    />
                    Student
                  </label>

                  <label htmlFor="teacher" className="flex items-center gap-2 cursor-pointer hover:text-blue-500">
                    <input
                      id="teacher"
                      type="radio"
                      value="teacher"
                      checked={role === 'teacher'}
                      onChange={() => setRole('teacher')}
                    />
                    Teacher
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-md text-lg font-semibold hover:bg-blue-700 transition"
                >
                  Sign In
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
