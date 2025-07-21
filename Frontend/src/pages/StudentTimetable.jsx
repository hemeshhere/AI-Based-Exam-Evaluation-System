import React, { useState, useEffect } from 'react';
import { Book, FlaskConical, Beaker, Landmark, Calendar, Clock, User, FileText, Star } from 'lucide-react';

const mockTimetableData = [
    { id: 'mock-exam-1', subject: 'Algebra I', section: '10A', date: '2025-07-22', startTime: '09:00', endTime: '10:30', room: 'Room 101', teacher: 'Ms. Davis' },
    { id: 'mock-exam-2', subject: 'Biology', section: '10A', date: '2025-07-22', startTime: '11:00', endTime: '12:30', room: 'Lab B', teacher: 'Mr. Johnson' },
    { id: 'mock-exam-3', subject: 'English Lit.', section: '10A', date: '2025-07-23', startTime: '14:00', endTime: '15:30', room: 'Auditorium', teacher: 'Mrs. Smith'},
    { id: 'mock-exam-4', subject: 'Chemistry', section: '10A', date: '2025-07-25', startTime: '09:30', endTime: '11:00', room: 'Lab A', teacher: 'Dr. Lee' },
    { id: 'mock-exam-5', subject: 'History', section: '10A', date: '2025-07-28', startTime: '13:00', endTime: '14:30', room: 'Room 205', teacher: 'Mr. Brown' }
];

// Helper to get a subject-specific icon and color
const getSubjectStyle = (subject) => {
    const s = subject.toLowerCase();
    if (s.includes('algebra') || s.includes('math')) {
        return { icon: <Book className="w-8 h-8 text-white" />, bg: 'bg-blue-500', shadow: 'hover:shadow-blue-200' };
    }
    if (s.includes('biology')) {
        return { icon: <FlaskConical className="w-8 h-8 text-white" />, bg: 'bg-green-500', shadow: 'hover:shadow-green-200' };
    }
    if (s.includes('chemistry')) {
        return { icon: <Beaker className="w-8 h-8 text-white" />, bg: 'bg-red-500', shadow: 'hover:shadow-red-200' };
    }
    if (s.includes('history')) {
        return { icon: <Landmark className="w-8 h-8 text-white" />, bg: 'bg-yellow-500', shadow: 'hover:shadow-yellow-200' };
    }
    // ✅ **FIX: Added a default style for any other subject**
    return { icon: <Book className="w-8 h-8 text-white" />, bg: 'bg-gray-500', shadow: 'hover:shadow-gray-200' };
};

// Helper function to group exams by date
const groupExamsByDate = (exams) => {
    return exams.reduce((acc, exam) => {
        const date = exam.date;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(exam);
        return acc;
    }, {});
};

const StudentTimetable = () => {
    const [groupedTimetable, setGroupedTimetable] = useState({});
    const [upcomingExamId, setUpcomingExamId] = useState(null);

    useEffect(() => {
        const sortedExams = [...mockTimetableData].sort((a, b) => new Date(a.date) - new Date(b.date));
        
        const now = new Date();
        // Set date to midnight to include today's exams
        now.setHours(0, 0, 0, 0); 
        const nextExam = sortedExams.find(exam => new Date(exam.date) >= now);
        
        setUpcomingExamId(nextExam ? nextExam.id : null);
        
        setGroupedTimetable(groupExamsByDate(sortedExams));
    }, []);

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                 <div className="bg-indigo-100 p-3 rounded-xl">
                    <Calendar className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Exam Timetable</h1>
                    <p className="text-gray-500">Your upcoming exam schedule.</p>
                </div>
            </div>

            <div className="space-y-8">
                {Object.keys(groupedTimetable).map(date => (
                    <div key={date}>
                        <h2 className="text-lg font-semibold text-gray-600 mb-4 pb-2 border-b-2 border-gray-200">
                            {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </h2>
                        <div className="space-y-6">
                            {groupedTimetable[date].map(entry => {
                                const isUpcoming = entry.id === upcomingExamId;
                                const style = getSubjectStyle(entry.subject);
                                return (
                                    <div
                                        key={entry.id}
                                        className={`rounded-xl overflow-hidden flex transition-all duration-300 ${isUpcoming ? 'shadow-2xl scale-105 ring-4 ring-indigo-300' : 'shadow-lg hover:shadow-xl'}`}
                                    >
                                        <div className={`w-24 flex flex-col items-center justify-center text-white text-center p-4 ${style.bg}`}>
                                            <p className="text-4xl font-bold">{new Date(entry.date).getDate()}</p>
                                            <p className="font-semibold">{new Date(entry.date).toLocaleString('default', { month: 'short' })}</p>
                                        </div>
                                        <div className="p-6 flex-grow bg-white">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-xl text-gray-900">{entry.subject}</h3>
                                                    <p className="text-gray-500 text-sm">{entry.room}</p>
                                                </div>
                                                {isUpcoming && (
                                                    <div className="flex items-center gap-2 bg-indigo-100 text-indigo-600 text-xs font-bold px-3 py-1 rounded-full">
                                                        <Star className="w-4 h-4" />
                                                        <span>UPCOMING</span>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                <div className="flex items-center text-gray-600 text-sm mb-2 sm:mb-0">
                                                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                                    <span>{entry.startTime} - {entry.endTime}</span>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <a href="#" className="flex items-center text-sm text-indigo-600 hover:underline">
                                                        <FileText className="w-4 h-4 mr-1" />
                                                        Syllabus
                                                    </a>
                                                    <a href="#" className="flex items-center text-sm text-indigo-600 hover:underline">
                                                        <User className="w-4 h-4 mr-1" />
                                                         {entry.teacher}
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentTimetable;