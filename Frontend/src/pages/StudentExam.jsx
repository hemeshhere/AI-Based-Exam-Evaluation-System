import React, { useState, useEffect, useRef } from 'react';
import { getActiveExams, startExam, submitExam } from '../services/apiServices';
import { BookOpen, Clock, Key, ChevronLeft, ChevronRight, Send, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Main component that manages the overall state
const StudentExam = () => {
    const [view, setView] = useState('list'); // 'list', 'taking', 'submitted'
    const [todaysExams, setTodaysExams] = useState([]);
    const [selectedExam, setSelectedExam] = useState(null); // For the modal
    const [currentSubmission, setCurrentSubmission] = useState(null); // For taking the exam
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (view === 'list') {
            const fetchExams = async () => {
                try {
                    setLoading(true);
                    const response = await getActiveExams();
                    setTodaysExams(response.data || []);
                } catch (err) {
                    setError('Failed to load today\'s exams.');
                } finally {
                    setLoading(false);
                }
            };
            fetchExams();
        }
    }, [view]);

    const handleStartExam = (submission) => {
        setCurrentSubmission(submission);
        setView('taking');
    };
    
    if (loading && view === 'list') return <div className="text-center p-10">Loading today's exams...</div>;

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <div className="bg-indigo-100 p-3 rounded-xl"><BookOpen className="w-8 h-8 text-indigo-600" /></div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Today's Exams</h1>
                    <p className="text-gray-500">Select an active exam or wait for an upcoming one to begin.</p>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {view === 'list' && (
                    <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <ExamList exams={todaysExams} onSelectExam={setSelectedExam} />
                    </motion.div>
                )}
                {view === 'taking' && currentSubmission && (
                     <motion.div key="taking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <ExamTaker submission={currentSubmission} onFinish={() => setView('submitted')} />
                    </motion.div>
                )}
                {view === 'submitted' && (
                    <motion.div key="submitted" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <SubmissionSuccess onGoBack={() => setView('list')} />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {selectedExam && <AccessCodeModal exam={selectedExam} onClose={() => setSelectedExam(null)} onStart={handleStartExam} />}
            </AnimatePresence>
        </div>
    );
};

// Component to list today's exams
const ExamList = ({ exams, onSelectExam }) => (
    <div className="space-y-4">
        {exams.length === 0 ? (
            <p className="text-center text-gray-500 mt-16 bg-white p-10 rounded-xl shadow-sm">No exams are scheduled for you today.</p>
        ) : (
            exams.map(exam => <ExamCard key={exam._id} exam={exam} onSelectExam={onSelectExam} />)
        )}
    </div>
);

// Individual card for each exam
const ExamCard = ({ exam, onSelectExam }) => {
    const [status, setStatus] = useState('upcoming');
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const startTime = new Date(exam.startTime);
            const endTime = new Date(exam.endTime);

            if (now < startTime) {
                setStatus('upcoming');
                const diff = startTime - now;
                const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
                const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
                const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
                setTimeLeft(`${h}:${m}:${s}`);
            } else if (now >= startTime && now <= endTime) {
                setStatus('active');
                setTimeLeft('');
            } else {
                setStatus('finished');
                setTimeLeft('');
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [exam.startTime, exam.endTime]);

    return (
        <div className={`bg-white rounded-xl shadow-lg p-5 flex items-center justify-between border border-gray-200 ${status === 'finished' && 'opacity-50'}`}>
            <div>
                <p className="font-bold text-lg text-gray-800">{exam.title}</p>
                <p className="text-sm text-gray-500">{exam.department}</p>
            </div>
            <div>
                {status === 'upcoming' && (
                    <div className="text-center">
                        <p className="font-bold text-indigo-600 text-lg">{timeLeft}</p>
                        <p className="text-xs text-gray-500">Starts In</p>
                    </div>
                )}
                {status === 'active' && (
                    <button onClick={() => onSelectExam(exam)} className="px-5 py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition shadow-md animate-pulse">
                        Start Now
                    </button>
                )}
                {status === 'finished' && (
                    <p className="px-5 py-2 font-semibold text-gray-600 bg-gray-200 rounded-lg">Finished</p>
                )}
            </div>
        </div>
    );
};

// ✅ FULLY IMPLEMENTED: Modal to enter the access code
const AccessCodeModal = ({ exam, onClose, onStart }) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await startExam(exam._id, code);
            onStart(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to start exam.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                <h3 className="text-xl font-bold text-gray-800 text-center">Enter Access Code</h3>
                <p className="text-center text-gray-500 text-sm mt-1">for "{exam.title}"</p>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="relative">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="text" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} maxLength={6} className="w-full p-3 pl-10 text-center tracking-[8px] font-mono text-lg border border-gray-300 rounded-lg" placeholder="------" required />
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 font-semibold">Cancel</button>
                        <button type="submit" disabled={loading} className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-semibold disabled:bg-gray-400">
                            {loading ? 'Starting...' : 'Begin'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

// ✅ FULLY IMPLEMENTED: The main exam-taking interface
const ExamTaker = ({ submission, onFinish }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState(() => {
        const initial = {};
        submission.exam.questions.forEach(q => { initial[q._id] = ''; });
        return initial;
    });
    const [timeLeft, setTimeLeft] = useState(submission.exam.durationMinutes * 60);
    const timerRef = useRef();

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    handleSubmit(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, []);

    const handleSubmit = async (isAutoSubmit = false) => {
        if (!isAutoSubmit && !window.confirm("Are you sure you want to submit?")) return;
        clearInterval(timerRef.current);
        const formattedAnswers = Object.entries(answers).map(([questionId, response]) => ({ question: questionId, response: response || '' }));
        try {
            await submitExam(submission._id, formattedAnswers);
            onFinish();
        } catch (err) {
            alert('Failed to submit exam. Please check your connection.');
        }
    };

    const handleAnswerChange = (questionId, value) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const currentQuestion = submission.exam.questions[currentIndex];
    const formatTime = (seconds) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

    return (
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
            <header className="pb-4 border-b mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{submission.exam.title}</h2>
                <div className="flex justify-between items-center mt-2 text-sm">
                    <p className="text-gray-500">Question {currentIndex + 1} of {submission.exam.questions.length}</p>
                    <div className={`flex items-center gap-2 font-semibold ${timeLeft < 60 ? 'text-red-500' : 'text-gray-600'}`}><Clock size={16} /><span>{formatTime(timeLeft)}</span></div>
                </div>
            </header>
            <main>
                <p className="font-semibold text-lg text-gray-800 mb-4">{currentQuestion.text} ({currentQuestion.marks} Marks)</p>
                {currentQuestion.type === 'MCQ' && (
                    <div className="space-y-3">
                        {currentQuestion.options.map(opt => (
                            <label key={opt._id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-indigo-50 cursor-pointer">
                                <input type="radio" name={currentQuestion._id} value={opt.text} checked={answers[currentQuestion._id] === opt.text} onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)} className="w-5 h-5" />
                                <span>{opt.text}</span>
                            </label>
                        ))}
                    </div>
                )}
                {currentQuestion.type === 'Subjective' && (
                    <textarea value={answers[currentQuestion._id]} onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)} rows="8" className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Type your answer here..." />
                )}
            </main>
            <footer className="flex justify-between items-center mt-8 pt-6 border-t">
                <button onClick={() => setCurrentIndex(i => i - 1)} disabled={currentIndex === 0} className="flex items-center gap-2 px-5 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg disabled:opacity-50"><ChevronLeft size={18} /> Previous</button>
                {currentIndex === submission.exam.questions.length - 1 ? (
                    <button onClick={() => handleSubmit(false)} className="flex items-center gap-2 px-5 py-2 font-semibold text-white bg-green-600 rounded-lg">Submit Exam <Send size={18} /></button>
                ) : (
                    <button onClick={() => setCurrentIndex(i => i + 1)} className="flex items-center gap-2 px-5 py-2 font-semibold text-white bg-indigo-600 rounded-lg">Next <ChevronRight size={18} /></button>
                )}
            </footer>
        </div>
    );
};

// ✅ FULLY IMPLEMENTED: Component to show after successful submission
const SubmissionSuccess = ({ onGoBack }) => (
    <div className="text-center bg-white p-10 rounded-xl shadow-lg">
        <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
        <h3 className="text-2xl font-bold text-gray-800">Exam Submitted Successfully!</h3>
        <p className="text-gray-500 mt-2">Your answers have been recorded. You can check the results page later for your score.</p>
        <button onClick={onGoBack} className="mt-6 px-6 py-2 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">Back to Exams</button>
    </div>
);

export default StudentExam;
