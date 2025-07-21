import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Award, MessageSquare, X, ChevronRight, ChevronLeft } from 'lucide-react';
import Globe from 'react-globe.gl'; // Import the globe component

// --- Mock Data ---
const testimonials = [
    {
        name: 'Sarah L.',
        quote: "AiEXAM's personalized feedback helped me identify my weak spots and improve my scores dramatically. It's a game-changer!",
        image: 'https://i.pravatar.cc/150?img=1',
    },
    {
        name: 'David C.',
        quote: "The interface is so intuitive and the exams are actually engaging. I've never felt more prepared.",
        image: 'https://i.pravatar.cc/150?img=2',
    },
    {
        name: 'Maria G.',
        quote: 'The instant results and detailed analytics are incredible. I can track my progress and focus my efforts where it matters most.',
        image: 'https://i.pravatar.cc/150?img=3',
    },
];

export default function StudentLogin() {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="w-full relative overflow-hidden bg-white">
            {/* Hero Section with Interactive Globe */}
            <HeroSection onGetStarted={() => setShowModal(true)} />

            {/* Features Section */}
            <FeaturesSection />

            {/* Testimonials Section */}
            <TestimonialsSection />

            {/* Signup Modal */}
            <SignupModal showModal={showModal} setShowModal={setShowModal} />
        </div>
    );
}

// --- Components ---

const HeroSection = ({ onGetStarted }) => {
    return (
        <div className="h-screen bg-gray-900 relative flex items-center justify-center text-white text-center overflow-hidden">
            <div className="absolute inset-0 z-0">
                <Globe
                    globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                    atmosphereColor="rgba(88, 81, 216, 0.7)"
                    atmosphereAltitude={0.25}
                />
            </div>
            <div className="relative z-10 p-4">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-5xl md:text-7xl font-extrabold mb-4"
                >
                    A New World of Learning
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="text-lg md:text-xl max-w-3xl mx-auto mb-8"
                >
                    Step into a smarter, more personalized educational experience. AiEXAM adapts to you, so you can achieve more.
                </motion.p>
                <motion.button
                    onClick={onGetStarted}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 rounded-full bg-indigo-500 text-white font-bold text-lg hover:bg-indigo-600 transition-all duration-300 shadow-lg"
                >
                    Begin Your Journey
                </motion.button>
            </div>
        </div>
    );
};

const FeaturesSection = () => (
    <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Why Students Thrive with AiEXAM</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <FeatureCard icon={<BookOpen />} title="Adaptive Learning" description="Our AI curates study paths just for you, turning weaknesses into strengths." />
                <FeatureCard icon={<Award />} title="Intelligent Exams" description="Experience fair, challenging exams that provide instant, actionable feedback." />
                <FeatureCard icon={<MessageSquare />} title="Real-Time Insights" description="Track your progress with detailed analytics and understand exactly where you stand." />
            </div>
        </div>
    </section>
);

const FeatureCard = ({ icon, title, description }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-50 p-8 rounded-xl text-center flex flex-col items-center hover:shadow-xl transition-shadow"
    >
        <div className="text-indigo-500 text-4xl mb-4">{icon}</div>
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </motion.div>
);

const TestimonialsSection = () => {
    const [current, setCurrent] = useState(0);

    const nextTestimonial = () => setCurrent(current === testimonials.length - 1 ? 0 : current + 1);
    const prevTestimonial = () => setCurrent(current === 0 ? testimonials.length - 1 : current - 1);

    useEffect(() => {
        const timer = setTimeout(nextTestimonial, 5000);
        return () => clearTimeout(timer);
    }, [current]);

    return (
        <section className="py-20 bg-indigo-50">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold text-gray-800 mb-12">From Our Students</h2>
                <div className="relative max-w-2xl mx-auto h-64">
                    <AnimatePresence>
                        <motion.div
                            key={current}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                            className="absolute inset-0 flex flex-col items-center justify-center"
                        >
                            <img src={testimonials[current].image} alt={testimonials[current].name} className="w-20 h-20 rounded-full mb-4 shadow-lg" />
                            <p className="text-xl italic text-gray-700">"{testimonials[current].quote}"</p>
                            <h4 className="mt-4 text-lg font-bold text-indigo-600">- {testimonials[current].name}</h4>
                        </motion.div>
                    </AnimatePresence>
                    <button onClick={prevTestimonial} className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/50 hover:bg-white transition">
                        <ChevronLeft />
                    </button>
                    <button onClick={nextTestimonial} className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/50 hover:bg-white transition">
                        <ChevronRight />
                    </button>
                </div>
            </div>
        </section>
    );
};

const SignupModal = ({ showModal, setShowModal }) => {
    // ... (SignupModal remains the same as previous version)
    return (
        <AnimatePresence>
            {showModal && (
                <motion.div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative"
                    >
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
                        >
                            <X />
                        </button>
                        <h2 className="text-3xl font-bold text-indigo-600 mb-6 text-center">Create Your Account</h2>
                        <form className="space-y-4">
                            <input type="text" placeholder="Full Name" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400" />
                            <input type="email" placeholder="Email Address" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400" />
                            <input type="password" placeholder="Create Password" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400" />
                            <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md">
                                Sign Up Now
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};