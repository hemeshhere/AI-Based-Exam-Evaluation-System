import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import img1 from '../assets/image1.jpg';
import img2 from '../assets/image2.jpg';
import img3 from '../assets/image3.jpg';

export default function StudentLogin() {
  const [showModal, setShowModal] = useState(false);

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = showModal ? 'hidden' : 'auto';
  }, [showModal]);

  return (
    <div className="w-full relative overflow-hidden">
      {/* 🌟 Hero Section */}
      <div
        className="h-[70vh] bg-cover bg-center relative flex items-center justify-center"
        style={{ backgroundImage: `url(${img1})` }}
      >
        <div className="absolute inset-0 bg-black opacity-60 z-0" />
        <div className="relative z-10 text-white text-center px-4 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to AiEXAM</h1>
          <p className="text-lg md:text-xl mb-4">
            🌟 Learn smarter, not harder.<br />
            📘 Explore limitless knowledge with AI.<br />
            🤝 Collaborate and grow with your peers.<br />
            🚀 Join the future of education today!
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-6 px-6 py-3 rounded-full bg-white bg-opacity-80 text-blue-700 font-semibold hover:bg-opacity-100 transition-all duration-300"
          >
            Sign Up for Free
          </button>
        </div>
      </div>

      {/* 🔹 Row 1 */}
      <div className="flex flex-col md:flex-row items-center justify-center px-6 py-16 gap-10 bg-white relative z-20">
        <div className="w-full md:w-1/2 flex justify-center">
          <motion.div
            whileHover={{ scale: 1.1, rotate: -1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="w-64 h-64 transform -rotate-3 shadow-lg rounded-xl overflow-hidden"
          >
            <img src={img2} alt="Step 1" className="w-full h-full object-cover" />
          </motion.div>
        </div>
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="text-center md:text-left w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">Personalized Learning Experience</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              At AiEXAM, every student receives a custom learning path powered by AI.
              Whether you're catching up or advancing ahead, your educational journey is uniquely tailored to suit your pace.
            </p>
          </div>
        </div>
      </div>

      {/* 🔸 Row 2 */}
      <div className="flex flex-col md:flex-row-reverse items-center justify-center px-6 py-16 gap-10 bg-white relative z-20">
        <div className="w-full md:w-1/2 flex justify-center">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="w-64 h-64 transform rotate-3 shadow-lg rounded-xl overflow-hidden"
          >
            <img src={img3} alt="Step 2" className="w-full h-full object-cover" />
          </motion.div>
        </div>
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="text-center md:text-left w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">Smarter Exams with Instant Feedback</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Exams just got easier! AiEXAM uses intelligent algorithms to evaluate answers in real-time
              and offer constructive feedback—making exams faster, fairer, and more effective for growth.
            </p>
          </div>
        </div>
      </div>

      {/* ✅ Signup Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="bg-white p-6 rounded-lg shadow-2xl w-[90%] max-w-md relative"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-xl"
              >
                &times;
              </button>

              <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">Student Sign Up</h2>
              <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" className="border border-gray-300 p-2 rounded" />
                <input type="text" placeholder="Last Name" className="border border-gray-300 p-2 rounded" />
                <input type="email" placeholder="Email" className="col-span-2 border border-gray-300 p-2 rounded" />
                <input type="password" placeholder="Password" className="col-span-2 border border-gray-300 p-2 rounded" />
                <input type="text" placeholder="Section" className="border border-gray-300 p-2 rounded" />
                <input type="text" placeholder="Year" className="border border-gray-300 p-2 rounded" />
                <select className="border border-gray-300 p-2 rounded">
                  <option value="">Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <input type="date" placeholder="DOB" className="border border-gray-300 p-2 rounded" />
                <textarea placeholder="Address" rows="2" className="col-span-2 border border-gray-300 p-2 rounded" />
                <button type="submit" className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                  Create Account
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
