import React, { useState, useEffect, useRef } from 'react';

const StudentExamPage = () => {
    // State to manage the current view: 'list' or 'exam'
    const [viewMode, setViewMode] = useState('list');
    const [availableExams, setAvailableExams] = useState([]);
    const [selectedExam, setSelectedExam] = useState(null); // Stores the full exam object once selected
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // For navigating questions

    const [answers, setAnswers] = useState({}); // Stores student's answers: { questionId: answerText/selectedOption }
    const [loading, setLoading] = useState(true); // Controls initial loading spinner for the list view
    const [error, setError] = useState(null); // Stores error message, also used to indicate fallback to dummy data
    const [timeLeft, setTimeLeft] = useState(0); // Time in seconds
    const timerRef = useRef(null); // Ref to hold the interval ID

    // State for the new message box
    const [message, setMessage] = useState({ text: '', type: '' });

    // Helper for displaying messages using React state
    const showMessage = (text, type = 'info') => {
        setMessage({ text, type });
        setTimeout(() => {
            setMessage({ text: '', type: '' });
        }, 3000);
    };

    // IMPORTANT: This 'studentSection' would typically come from
    // the logged-in student's profile, a user context, or passed as a prop.
    const studentSection = "10A"; // <--- CHANGE THIS TO THE STUDENT'S ACTUAL SECTION

    // Dummy data for available exams list (as fallback and initial display)
    const mockAvailableExams = [
        {
            id: 'exam-mock-123',
            title: 'Introduction to Computer Science (Dummy)',
            description: 'A comprehensive exam covering fundamental CS concepts. (This is a dummy exam)',
            section: '10A',
            date: '2025-08-01',
            startTime: '10:00',
            endTime: '12:00',
            duration: 120, // Duration in minutes
            totalMarks: 100,
            teacher: 'Prof. Alice',
            questions: [ // Include questions here for mock data to avoid a second mock fetch
                { id: 'q1', type: 'MCQ', questionText: 'What does CPU stand for?', options: ['Central Process Unit', 'Central Processing Unit', 'Computer Personal Unit', 'Central Peripheral Unit'], correctAnswer: 'Central Processing Unit', marks: 5 },
                { id: 'q2', type: 'subjective', questionText: 'Explain the concept of Object-Oriented Programming (OOP) and list its four main pillars.', marks: 15, modelAnswer: 'OOP is a programming paradigm based on the concept of "objects", which can contain data and code. Its four main pillars are Encapsulation, Inheritance, Polymorphism, and Abstraction.' },
                { id: 'q3', type: 'MCQ', questionText: 'Which data structure uses LIFO principle?', options: ['Queue', 'Linked List', 'Stack', 'Tree'], correctAnswer: 'Stack', marks: 5 },
                { id: 'q4', type: 'subjective', questionText: 'Describe the difference between HTTP and HTTPS.', marks: 10, modelAnswer: 'HTTP is Hypertext Transfer Protocol, used for transmitting hypermedia documents. HTTPS is Hypertext Transfer Protocol Secure, which is the secure version of HTTP, using SSL/TLS for encryption.' }
            ]
        },
        {
            id: 'exam-mock-124',
            title: 'Advanced Mathematics (Dummy)',
            description: 'Algebra, Calculus, and Geometry. (This is a dummy exam)',
            section: '10A',
            date: '2025-08-05',
            startTime: '09:30',
            endTime: '11:30',
            duration: 120,
            totalMarks: 80,
            teacher: 'Mr. David',
            questions: [
                { id: 'q5', type: 'MCQ', questionText: 'What is the derivative of x^2?', options: ['x', '2x', 'x^3/3', '2'], correctAnswer: '2x', marks: 10 },
                { id: 'q6', type: 'subjective', questionText: 'Prove the Pythagorean theorem.', marks: 20, modelAnswer: 'Proof involves constructing a right triangle and using areas of squares on its sides.' }
            ]
        },
        {
            id: 'exam-mock-125',
            title: 'World History (Dummy)',
            description: 'Exam on 20th Century conflicts. (This is a dummy exam)',
            section: '10B', // Different section
            date: '2025-08-10',
            startTime: '14:00',
            endTime: '15:30',
            duration: 90,
            totalMarks: 75,
            teacher: 'Ms. Green',
            questions: [
                { id: 'q7', type: 'subjective', questionText: 'Discuss the causes of World War I.', marks: 25, modelAnswer: 'Militarism, Alliances, Imperialism, Nationalism (MAIN).' },
                { id: 'q8', type: 'MCQ', questionText: 'Which country was NOT part of the Triple Entente?', options: ['France', 'Russia', 'Germany', 'Great Britain'], correctAnswer: 'Germany', marks: 10 }
            ]
        }
    ];

    // --- Effect for fetching available exams (List View) ---
    useEffect(() => {
        const loadExams = async () => {
            setLoading(true); // Indicate loading initially
            setError(null); // Clear any previous errors

            // 1. Immediately set dummy data for display
            const initialExams = mockAvailableExams.filter(exam => exam.section === studentSection);
            initialExams.sort((a, b) => {
                const dateA = new Date(`${a.date}T${a.startTime}`);
                const dateB = new Date(`${b.date}T${b.startTime}`);
                return dateA - dateB;
            });
            setAvailableExams(initialExams); // Display dummy data instantly
            console.log("Initial load: Displaying dummy exams:", initialExams);
            setLoading(false); // No longer "loading" in the sense of waiting for *any* data to appear

            // 2. Now, attempt to fetch real data in the background
            try {
                const yourAuthToken = localStorage.getItem('token'); // Retrieve token from localStorage after login
                const response = await fetch(`http://localhost:5000/api/exams?section=${studentSection}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${yourAuthToken}` // Include auth token for protected routes
                    }
                });

                if (!response.ok) {
                    // Attempt to parse error message from backend if available
                    let errorMessage = `HTTP error! status: ${response.status}`;
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.message || errorMessage;
                    } catch (jsonError) {
                        console.warn("Could not parse error response as JSON:", jsonError);
                    }
                    throw new Error(errorMessage);
                }
                const realData = await response.json();

                // Filter exams by student's section (if not done by backend query or if backend returns all)
                let filteredRealExams = realData.filter(exam => exam.section === studentSection);

                // Sort exams by date and time
                filteredRealExams.sort((a, b) => {
                    const dateA = new Date(`${a.date}T${a.startTime}`);
                    const dateB = new Date(`${b.date}T${b.startTime}`);
                    return dateA - dateB;
                });

                setAvailableExams(filteredRealExams); // Replace dummy with real data
                console.log("Successfully fetched and displaying REAL exams:", filteredRealExams);
                showMessage("Exams loaded successfully!", "success");
                setError(null); // Clear error if real data is successfully loaded

            } catch (err) {
                console.error("Error fetching available exams from backend:", err);
                // Set error message for the user, indicating a fallback to dummy data
                setError(`Failed to load exams from backend: ${err.message}. Showing sample data.`);
                showMessage(`Failed to load exams: ${err.message}`, "error");
                // availableExams already holds dummy data from initial setting, so it remains.
                // The error state will now trigger the inline message.
            }
        };

        if (viewMode === 'list') {
            loadExams();
        }
    }, [viewMode, studentSection]); // Dependencies remain the same

    // --- Effect for Exam Taking View (when an exam is selected) ---
    useEffect(() => {
        if (viewMode === 'exam' && selectedExam) {
            // Initialize answers state with empty strings for subjective or null for MCQ
            const initialAnswers = {};
            selectedExam.questions.forEach(q => {
                initialAnswers[q.id] = q.type === 'MCQ' ? null : '';
            });
            setAnswers(initialAnswers);
            console.log("Initializing answers for exam (type, data):", typeof initialAnswers, initialAnswers);
            setTimeLeft(selectedExam.duration * 60); // Initialize timer in seconds

            // Start the timer
            timerRef.current = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime <= 1) {
                        clearInterval(timerRef.current);
                        handleSubmitExam(true); // Auto-submit when time runs out
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }

        // Cleanup timer when leaving exam mode or component unmounts
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [viewMode, selectedExam]); // Depend on viewMode and selectedExam

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleAnswerChange = (questionId, value) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: value
        }));
    };

    const handleStartExam = (examToStart) => {
        setSelectedExam(examToStart);
        setViewMode('exam');
        setCurrentQuestionIndex(0); // Start from the first question
    };

    const handleNextQuestion = () => {
        if (selectedExam && currentQuestionIndex < selectedExam.questions.length - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prevIndex => prevIndex - 1);
        }
    };

    const handleSubmitExam = async (isAutoSubmit = false) => {
        if (!selectedExam) return;

        // Confirmation for manual submission
        if (!isAutoSubmit) {
            // Using a simple window.confirm, consider a custom modal for better UX
            if (!window.confirm("Are you sure you want to submit the exam? You cannot make changes after submission.")) {
                return;
            }
        }

        setLoading(true); // Set loading for submission
        clearInterval(timerRef.current); // Stop the timer

        try {
            // Prepare submission data
            // Ensure studentId is retrieved from actual authentication context/localStorage
            const studentId = localStorage.getItem('userId') || 'default-student-id'; // Placeholder: Get actual student ID
            const yourAuthToken = localStorage.getItem('token'); // Retrieve token from localStorage after login

            const submissionData = {
                examId: selectedExam.id,
                studentId: studentId,
                answers: selectedExam.questions.map(q => ({
                    question: q.id, // This should be the question's MongoDB _id if using real backend
                    answerText: answers[q.id] || (q.type === 'MCQ' ? null : ''), // Ensure answer is recorded
                })),
                submittedAt: new Date().toISOString()
            };

            // --- REAL API CALL TO YOUR BACKEND ---
            // This will send the student's answers to your backend's submission endpoint
            // Ensure your backend has a POST /api/exams/:id/submit route and corresponding controller logic
            const response = await fetch(`http://localhost:5000/api/exams/${selectedExam.id}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${yourAuthToken}` // Include auth token
                },
                body: JSON.stringify(submissionData)
            });

            if (!response.ok) {
                // Attempt to parse error message from backend if available
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (jsonError) {
                    console.warn("Could not parse error response as JSON:", jsonError);
                }
                throw new Error(errorMessage);
            }

            // const result = await response.json(); // Backend might return initial submission status or confirmation

            showMessage("Exam submitted successfully! Results will be available soon.", "success");

            // After submission, revert to list view or show a success message
            setSelectedExam(null); // Clear selected exam
            setAnswers({}); // Clear answers
            setViewMode('list'); // Go back to exam list
            setLoading(false); // End loading state

        } catch (err) {
            console.error("Error submitting exam:", err);
            setError(`Failed to submit exam: ${err.message}. Please try again.`);
            showMessage(`Failed to submit exam: ${err.message}`, "error");
            setLoading(false); // End loading state
        }
    };

    // --- Render Logic based on viewMode ---

    if (loading && viewMode === 'list') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-xl text-gray-700">Loading available exams...</p>
            </div>
        );
    }

    if (viewMode === 'list') {
        return (
            <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-8 bg-gray-100">
                <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6 sm:p-8 md:p-10">
                    <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-8">
                        Available Exams for Your Section ({studentSection})
                    </h1>

                    {/* Display error message above the exams if fetch failed */}
                    {error && (
                        <div className="text-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                            <strong className="font-bold">Error: </strong>
                            <span className="block sm:inline">{error}</span>
                            <button
                                onClick={() => {
                                    // Reset error and re-trigger fetch attempt
                                    setError(null);
                                    setLoading(true);
                                    // The useEffect will automatically re-run loadExams()
                                }}
                                className="ml-4 bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700 transition text-sm"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {/* Display message if showing dummy data due to error */}
                    {error && availableExams.length > 0 && (
                        <div className="text-center bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-6" role="alert">
                            <strong className="font-bold">Note: </strong>
                            <span className="block sm:inline">These are sample exams displayed due to a backend connection issue.</span>
                        </div>
                    )}

                    {availableExams.length === 0 && !loading && !error && (
                        <div className="mt-8 text-center text-gray-600 text-lg">
                            <p>No exams currently available for your section.</p>
                            <p className="text-sm text-gray-500 mt-2">Please check back later.</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {availableExams.map(examEntry => (
                            <div
                                key={examEntry.id}
                                className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm flex flex-col justify-between items-start"
                            >
                                <h3 className="font-medium text-gray-800 text-lg mb-2">{examEntry.title}</h3>
                                <p className="text-sm text-gray-600 mb-1">
                                    <span className="font-semibold">Date:</span> {new Date(examEntry.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                </p>
                                <p className="text-sm text-gray-500 mb-2">
                                    <span className="font-semibold">Time:</span> {examEntry.startTime} - {examEntry.endTime}
                                </p>
                                <p className="text-xs text-gray-400">
                                    Teacher: {examEntry.teacher}
                                </p>
                                <button
                                    onClick={() => handleStartExam(examEntry)}
                                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200 ease-in-out shadow-md"
                                >
                                    Start Exam
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Message Box for user feedback - Rendered conditionally based on message state */}
                {message.text && (
                    <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white z-50 ${
                        message.type === 'error' ? 'bg-red-600' : message.type === 'success' ? 'bg-green-600' : 'bg-blue-600'
                    }`}>
                        {message.text}
                    </div>
                )}
            </div>
        );
    }

    // --- Render Logic for Exam Taking View ---
    // Ensure currentQuestion is safely accessed
    const currentQuestion = selectedExam?.questions?.[currentQuestionIndex];

    if (!currentQuestion) {
        // This case should ideally not be reached if selectedExam and its questions are properly loaded
        // but provides a safeguard against undefined errors during rendering.
        // This can happen if selectedExam becomes null after submission, or if questions array is empty/invalid.
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-xl text-gray-700">Exam data not found or invalid question index. Returning to exam list...</p>
                <button
                    onClick={() => setViewMode('list')}
                    className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                >
                    Back to Exams
                </button>
            </div>
        );
    }

    const isFirstQuestion = currentQuestionIndex === 0;
    const isLastQuestion = currentQuestionIndex === selectedExam.questions.length - 1;

    return (
        <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-8 bg-gray-100">
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6 sm:p-8 md:p-10">
                <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-4">
                    {selectedExam.title}
                </h1>
                <p className="text-center text-gray-600 mb-6">{selectedExam.description}</p>

                <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-lg font-medium text-gray-700">Time Left: <span className={`font-bold ${timeLeft <= 60 ? 'text-red-600' : 'text-blue-600'}`}>{formatTime(timeLeft)}</span></p>
                    <p className="text-lg font-medium text-gray-700">Total Marks: <span className="font-bold text-green-600">{selectedExam.totalMarks}</span></p>
                    <p className="text-lg font-medium text-gray-700">Question: <span className="font-bold text-purple-600">{currentQuestionIndex + 1}/{selectedExam.questions.length}</span></p>
                </div>

                {/* Current Question Display */}
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
                    <p className="text-lg font-semibold text-gray-800 mb-3">
                        {currentQuestionIndex + 1}. {currentQuestion.questionText} <span className="text-sm font-normal text-gray-500">({currentQuestion.marks} Marks)</span>
                    </p>

                    {currentQuestion.type === 'MCQ' && (
                        <div className="space-y-2">
                            {/* Ensure currentQuestion.options is an array before mapping */}
                            {Array.isArray(currentQuestion.options) && currentQuestion.options.map((option, optIndex) => (
                                <label key={optIndex} className="flex items-center text-gray-700 cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`question-${currentQuestion.id}`}
                                        value={option}
                                        checked={answers[currentQuestion.id] === option}
                                        onChange={() => handleAnswerChange(currentQuestion.id, option)}
                                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>
                    )}

                    {currentQuestion.type === 'subjective' && (
                        <textarea
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-32 resize-y"
                            placeholder="Type your answer here..."
                            value={answers[currentQuestion.id] || ''}
                            onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                        ></textarea>
                    )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between gap-4 mb-6">
                    <button
                        onClick={handlePreviousQuestion}
                        disabled={isFirstQuestion}
                        className={`py-2 px-6 rounded-md transition duration-200 ease-in-out font-semibold ${
                            isFirstQuestion ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md'
                        }`}
                    >
                        Previous
                    </button>
                    {/* Conditional rendering for Next or End Exam button */}
                    {isLastQuestion ? (
                        <button
                            onClick={() => handleSubmitExam(false)} // Explicitly not auto-submit
                            className="py-2 px-6 rounded-md transition duration-200 ease-in-out font-semibold bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg"
                            disabled={loading} // Use loading state for submission process
                        >
                            {loading ? 'Submitting Exam...' : 'End Exam'}
                        </button>
                    ) : (
                        <button
                            onClick={handleNextQuestion}
                            className="py-2 px-6 rounded-md transition duration-200 ease-in-out font-semibold bg-blue-500 text-white hover:bg-blue-600 shadow-md"
                        >
                            Next
                        </button>
                    )}
                </div>

                {/* Removed the standalone End Exam button from here */}
            </div>
            {/* Message Box for user feedback - Rendered conditionally based on message state */}
            {message.text && (
                <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white z-50 ${
                    message.type === 'error' ? 'bg-red-600' : message.type === 'success' ? 'bg-green-600' : 'bg-blue-600'
                }`}>
                    {message.text}
                </div>
            )}
        </div>
    );
};

export default StudentExamPage;
