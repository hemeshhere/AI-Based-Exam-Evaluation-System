import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail } from 'lucide-react';
import LoginParticles from './LoginParticles';

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
		setUser({ name: form.name, email: form.email, role });
		navigate(role === 'student' ? '/student-dashboard' : '/teacher-dashboard');
		setShowModal(false);
	};

	return (
		<AnimatePresence>
			{showModal && (
				<motion.div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					{/* Background Particles */}
					<div className="absolute inset-0 z-0 pointer-events-none">
						<LoginParticles />
					</div>

					{/* Login Box */}
					<motion.div
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.9, opacity: 0 }}
						transition={{ type: 'spring', stiffness: 200 }}
						className="relative z-10 w-full max-w-md px-8 py-10 rounded-2xl bg-[#111111]/90 backdrop-blur-md border border-cyan-500 shadow-[0_0_30px_rgba(0,255,255,0.4)] hover:shadow-[0_0_70px_cyan] transition duration-500"
					>
						{/* Close Button */}
						<button
							onClick={() => setShowModal(false)}
							className="absolute top-3 right-4 text-white text-2xl hover:text-red-400"
						>
							&times;
						</button>

						<h2 className="text-3xl font-bold text-center text-cyan-300 mb-6">Login</h2>

						<form onSubmit={handleSubmit} className="space-y-4 text-white">
							{/* Username */}
							<div className="relative">
								<User className="absolute left-3 top-2.5 text-cyan-400 w-5 h-5" />
								<input
									type="text"
									name="name"
									placeholder="Username"
									onChange={handleChange}
									required
									className="w-full pl-10 pr-4 py-2 rounded-md bg-[#222] border border-cyan-600 placeholder-gray-400 text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none"
								/>
							</div>

							{/* Email */}
							<div className="relative">
								<Mail className="absolute left-3 top-2.5 text-cyan-400 w-5 h-5" />
								<input
									type="email"
									name="email"
									placeholder="Email"
									onChange={handleChange}
									required
									className="w-full pl-10 pr-4 py-2 rounded-md bg-[#222] border border-cyan-600 placeholder-gray-400 text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none"
								/>
							</div>

							{/* Password */}
							<div className="relative">
								<Lock className="absolute left-3 top-2.5 text-cyan-400 w-5 h-5" />
								<input
									type="password"
									name="password"
									placeholder="Password"
									onChange={handleChange}
									required
									className="w-full pl-10 pr-4 py-2 rounded-md bg-[#222] border border-cyan-600 placeholder-gray-400 text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none"
								/>
							</div>

							{/* Remember Me + Forgot Password */}
							<div className="flex justify-between text-sm text-gray-400 px-1">
								<label className="flex items-center gap-1">
									<input type="checkbox" className="accent-cyan-400" />
									Remember Me
								</label>
								<button type="button" className="hover:text-cyan-300 hover:underline transition">
									Forgot Password?
								</button>
							</div>

							{/* Role Toggle */}
							<div className="flex justify-center gap-6 mt-2 text-sm text-gray-300">
								<label className="flex items-center gap-2 cursor-pointer hover:text-cyan-300">
									<input
										type="radio"
										value="student"
										checked={role === 'student'}
										onChange={() => setRole('student')}
									/>
									Student
								</label>
								<label className="flex items-center gap-2 cursor-pointer hover:text-cyan-300">
									<input
										type="radio"
										value="teacher"
										checked={role === 'teacher'}
										onChange={() => setRole('teacher')}
									/>
									Teacher
								</label>
							</div>

							{/* Login Button */}
							<button
								type="submit"
								className="w-full bg-cyan-500 hover:bg-cyan-600 text-black py-2 rounded-md text-lg font-semibold shadow-md hover:shadow-[0_0_20px_cyan] transition"
							>
								Login
							</button>
						</form>

						{/* Divider */}
						<div className="mt-6 text-center">
							<p className="text-sm text-gray-400 mb-2">or</p>
							<button className="w-full border border-cyan-400 hover:border-cyan-500 text-white py-2 rounded-md flex items-center justify-center gap-2 hover:bg-cyan-500/10 transition">
								<img
									src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
									alt="Google"
									className="w-5 h-5"
								/>
								<span>Sign in with Google</span>
							</button>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
