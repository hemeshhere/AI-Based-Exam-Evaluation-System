import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from './Footer';
import TestimonialChat from './TestimonialChat';

import img1 from '../assets/image1.jpg';
import img2 from '../assets/image2.jpg';
import img3 from '../assets/image3.jpg';
import img4 from '../assets/image4.jpg';
import img5 from '../assets/image5.jpg';
import img6 from '../assets/image6.jpg';
import img7 from '../assets/image7.jpg';
import img8 from '../assets/image8.jpg';

export default function RoleSelector() {
  const navigate = useNavigate();

  const handleSelect = (role) => navigate('/login', { state: { role } });
  const goToLogin = (signup = false) =>
    navigate('/login', { state: { role: 'student', isSignup: signup } });

  const imageSets = [
    [img1, img2, img3, img4, img5, img6, img7, img8],
    [img5, img6, img7, img8, img1, img2, img3, img4],
    [img3, img4, img1, img2, img7, img8, img5, img6],
  ];

  const [currentSet, setCurrentSet] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);

  const heroLines = [
    "Loved by millions of students and teachers.",
    "Making learning fun and smarter.",
    "Trusted by educators worldwide.",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSet((prev) => (prev + 1) % imageSets.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const lineTimer = setInterval(() => {
      setLineIndex((prev) => (prev + 1) % heroLines.length);
    }, 3000);
    return () => clearInterval(lineTimer);
  }, []);

  const images = imageSets[currentSet];

  return (
    <div className="min-h-screen bg-white">
      {/* ✅ Navbar */}
      <nav className="w-full flex justify-between items-center px-6 py-4 shadow-sm border-b bg-white">
        <h1 className="text-2xl font-bold text-blue-600">AiEXAM</h1>
        <div className="flex gap-4">
          <button
            onClick={() => goToLogin(false)}
            className="px-4 py-2 rounded-md font-medium border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
          >
            Sign In
          </button>
          <button
            onClick={() => goToLogin(true)}
            className="px-4 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* ✅ Hero */}
      <div className="px-4 py-12 flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 leading-tight">
          Where classrooms <br /> become communities
        </h1>

        {/* ✅ Animated Hero Lines */}
        <AnimatePresence mode="wait">
          <motion.p
            key={lineIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
            className="mt-4 text-lg md:text-xl text-center text-gray-600"
          >
            {heroLines[lineIndex]}
            <br />
            <span className="font-semibold text-blue-600">
              Free for everyone, forever.
            </span>
          </motion.p>
        </AnimatePresence>

        {/* Role Buttons */}
        <h2 className="mt-10 text-lg font-semibold text-gray-800">
          Get started as a...
        </h2>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button
            onClick={() => handleSelect('student')}
            className="w-64 h-40 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md bg-white flex flex-col items-center justify-center space-y-2 transition"
          >
            <GraduationCap className="w-10 h-10 text-green-500" />
            <span className="text-lg font-semibold text-gray-800">Student</span>
            <span className="text-sm text-blue-500">→</span>
          </button>

          <button
            onClick={() => handleSelect('teacher')}
            className="w-64 h-40 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md bg-white flex flex-col items-center justify-center space-y-2 transition"
          >
            <User className="w-10 h-10 text-pink-500" />
            <span className="text-lg font-semibold text-gray-800">Teacher</span>
            <span className="text-sm text-blue-500">→</span>
          </button>
        </div>
      </div>

      {/* ✅ Hanging Images */}
      <div className="relative bg-white-50 py-16 overflow-hidden">
        <div className="relative z-10 flex justify-start flex-wrap gap-x-10 gap-y-12 px-6 max-w-6xl mx-auto">
          {images.map((img, index) => (
            <div key={index} className="flex flex-col items-center swing">
              <div className="w-1 h-10 bg-blue-300" />
              <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white -mt-2 z-10 shadow" />
              <img
                src={img}
                alt={`Hanging ${index + 1}`}
                className="w-44 h-44 object-cover rounded-xl border-4 border-white shadow-md transform hover:rotate-0 transition duration-500"
              />
            </div>
          ))}
        </div>
        <h2 className="mt-16 text-2xl md:text-3xl font-bold text-center text-slate-800">
          Keeping teachers and student connected
        </h2>
      </div>

      {/* 🌀 CSS Animations */}
      <style>
        {`
          @keyframes swing {
            0% { transform: rotate(1deg); }
            50% { transform: rotate(-1.5deg); }
            100% { transform: rotate(1deg); }
          }

          .swing {
            animation: swing 4s ease-in-out infinite;
          }
        `}
      </style>

      <TestimonialChat />
      <Footer />
    </div>
  );
}
