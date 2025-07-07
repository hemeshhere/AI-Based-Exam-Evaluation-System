import { useState } from 'react';
import studentImage from '../assets/student.jpg';
import teacherImage from '../assets/teacher.jpg';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login() {
  const [role, setRole] = useState('student');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignup) {
      alert(`${role} Signed Up! (Handle backend here)`);
    } else {
      navigate(role === 'student' ? '/student' : '/teacher');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="flex w-full max-w-5xl h-[540px] gap-6 rounded-3xl shadow-2xl overflow-hidden bg-white border border-blue-200">
        {/* Image section with animation */}
        <motion.div
          initial={{ x: -100, opacity: 0, scale: 0.9 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-1/2 relative hidden md:block overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={role}
              src={role === 'student' ? studentImage : teacherImage}
              alt={role}
              initial={{ opacity: 0, scale: 0.95, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: 20 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full object-cover absolute inset-0"
            />
          </AnimatePresence>

          <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/40 to-transparent text-white text-xl font-semibold text-center py-2 z-10">
            {role === 'student' ? 'Hello Student 👨‍🎓' : 'Welcome Teacher 👩‍🏫'}
          </div>
        </motion.div>

        {/* Form section */}
        <motion.div
          initial={{ x: 100, opacity: 0, scale: 0.9 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full md:w-1/2 bg-white p-10 flex flex-col items-center justify-center"
        >
          {/* Toggle Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setIsSignup(false)}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                !isSignup
                  ? 'bg-blue-600 text-white'
                  : 'border border-blue-600 text-blue-600 hover:bg-blue-50'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsSignup(true)}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                isSignup
                  ? 'bg-blue-600 text-white'
                  : 'border border-blue-600 text-blue-600 hover:bg-blue-50'
              }`}
            >
              Signup
            </button>
          </div>

          {/* Animated Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={isSignup ? 'signup' : 'login'}
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="w-full space-y-5"
            >
              <h2 className="text-3xl font-bold text-blue-600 text-center drop-shadow-sm">
                {isSignup ? 'Create Account' : 'Login Portal'}
              </h2>

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
                {isSignup ? 'Sign Up' : 'Login'}
              </button>
            </motion.form>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
