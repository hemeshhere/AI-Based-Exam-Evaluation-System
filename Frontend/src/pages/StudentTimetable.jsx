import React, { useState, useEffect } from 'react';

// Helper for displaying messages instead of alert()
const showMessage = (message, type = 'info') => {
    const messageBox = document.getElementById('message-box');
    if (!messageBox) {
        console.error('Message box element not found!');
        return;
    }
    messageBox.textContent = message;
    messageBox.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white z-50 ${
        type === 'error' ? 'bg-red-600' : type === 'success' ? 'bg-green-600' : 'bg-blue-600'
    }`;
    messageBox.classList.remove('hidden');
    setTimeout(() => {
        messageBox.classList.add('hidden');
    }, 3000);
};

const StudentTimetable = () => {
    const [timetable, setTimetable] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // IMPORTANT: In a real application, this 'studentSection' would come from
    // the logged-in student's profile, a user context, or passed as a prop.
    // For demonstration, we'll use a hardcoded value.
    const studentSection = "10A"; // <--- CHANGE THIS TO THE STUDENT'S ACTUAL SECTION

    // Dummy Timetable Data for demonstration and fallback
    const mockTimetableData = [
        {
            id: 'mock-exam-1',
            subject: 'Algebra I',
            section: '10A',
            date: '2025-07-20',
            startTime: '09:00',
            endTime: '10:30',
            room: 'Room 101',
            teacher: 'Ms. Davis',
            teacherId: 'teacher123'
        },
        {
            id: 'mock-exam-2',
            subject: 'Biology',
            section: '10A',
            date: '2025-07-22',
            startTime: '11:00',
            endTime: '12:30',
            room: 'Lab B',
            teacher: 'Mr. Johnson',
            teacherId: 'teacher124'
        },
        {
            id: 'mock-exam-3',
            subject: 'English Lit.',
            section: '10B', // This entry is for a different section
            date: '2025-07-23',
            startTime: '14:00',
            endTime: '15:30',
            room: 'Auditorium',
            teacher: 'Mrs. Smith',
            teacherId: 'teacher125'
        },
        {
            id: 'mock-exam-4',
            subject: 'Chemistry',
            section: '10A',
            date: '2025-07-25',
            startTime: '09:30',
            endTime: '11:00',
            room: 'Lab A',
            teacher: 'Dr. Lee',
            teacherId: 'teacher126'
        },
        {
            id: 'mock-exam-5',
            subject: 'History',
            section: '10A',
            date: '2025-07-28',
            startTime: '13:00',
            endTime: '14:30',
            room: 'Room 205',
            teacher: 'Mr. Brown',
            teacherId: 'teacher127'
        }
    ];

    useEffect(() => {
        const fetchTimetable = async () => {
            setLoading(true);
            setError(null);
            try {
                // --- REAL API CALL TO YOUR BACKEND ---
                // Replace 'http://localhost:5000' with your actual backend URL if it's different.
                // The '/api/exams' endpoint is based on your Backend/routes/examRoutes.js.
                // The 'section' query parameter filters exams for this student's section.
                const yourAuthToken = localStorage.getItem('token'); // Retrieve token from localStorage after login

                const response = await fetch(`http://localhost:5000/api/exams?section=${studentSection}`, {
                   headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${yourAuthToken}` // Include auth token for protected routes
                   }
                });

                if (!response.ok) {
                    // If the response is not OK (e.g., 401, 404, 500), throw an error
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                // Sort the timetable by date and then start time for consistent display
                let sortedData = data.sort((a, b) => {
                    const dateA = new Date(`${a.date}T${a.startTime}`);
                    const dateB = new Date(`${b.date}T${b.startTime}`);
                    return dateA - dateB;
                });

                setTimetable(sortedData);

            } catch (err) {
                console.error("Error fetching timetable:", err);
                // Set error message for the user
                setError(`Failed to load timetable from backend: ${err.message}. Displaying sample data.`);
                showMessage(`Failed to load timetable: ${err.message}`, "error");

                // Fallback to dummy data if fetch fails
                const fallbackTimetable = mockTimetableData.filter(entry => entry.section === studentSection);
                fallbackTimetable.sort((a, b) => {
                    const dateA = new Date(`${a.date}T${a.startTime}`);
                    const dateB = new Date(`${b.date}T${b.startTime}`);
                    return dateA - dateB;
                });
                setTimetable(fallbackTimetable);

            } finally {
                setLoading(false);
            }
        };

        fetchTimetable();
        // In a real app, if you need real-time updates (like Firestore's onSnapshot),
        // you would implement WebSockets or periodic polling here, as standard REST
        // API calls are one-time fetches.
    }, [studentSection]); // Re-fetch if studentSection changes

    return (
        <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-8 bg-gray-100">
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6 sm:p-8 md:p-10">
                <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-8">
                    Your Exam Timetable
                </h1>

                {loading && (
                    <p className="col-span-full text-center text-gray-500 text-lg" id="loading-message">
                        Loading timetable...
                    </p>
                )}

                {error && !loading && (
                    <div className="mt-8 text-center text-red-600 text-lg">
                        <p>{error}</p>
                        <p className="text-sm text-gray-500 mt-2">Please ensure your backend server is running and accessible.</p>
                    </div>
                )}

                {!loading && timetable.length === 0 && !error && (
                    <div className="mt-8 text-center text-gray-600 text-lg" id="no-timetable-message">
                        <p>No exam timetable available for your section (<span className="font-semibold">{studentSection}</span>) yet.</p>
                        <p className="text-sm text-gray-500 mt-2">Please check back later or contact your teacher.</p>
                    </div>
                )}

                {!loading && timetable.length > 0 && (
                    <div id="timetable-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {timetable.map(entry => (
                            <div
                                key={entry.id} // Use the unique ID from your backend data
                                className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center"
                            >
                                <div className="flex-grow mb-2 sm:mb-0">
                                    <p className="font-medium text-gray-800 text-lg">{entry.subject}</p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold">Class:</span> {entry.section} | <span className="font-semibold">Date:</span> {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        <span className="font-semibold">Time:</span> {entry.startTime} - {entry.endTime} | <span className="font-semibold">Room:</span> {entry.room}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Set by: {entry.teacher} (ID: {entry.teacherId ? entry.teacherId.substring(0, 8) + '...' : 'N/A'})
                                    </p>
                                </div>
                                {/* No delete button for students */}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {/* Message Box for user feedback */}
            <div id="message-box" className="hidden"></div>
        </div>
    );
};

export default StudentTimetable;

