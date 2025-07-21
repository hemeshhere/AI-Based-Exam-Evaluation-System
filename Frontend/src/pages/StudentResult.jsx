import React from 'react';
import { ChevronRight } from 'lucide-react';

const resultsData = [
    { subject: 'Mathematics', score: 'A+', status: 'Declared' },
    { subject: 'English Literature', score: 'B', status: 'Declared' },
    { subject: 'Physics', score: null, status: 'Not Declared Yet' }
];

export default function StudentResult() {
    return (
        <section id="result">
            <h2 className="text-3xl font-bold mb-6 text-gray-700">Results</h2>
            <div className="space-y-4">
                {resultsData.map((result, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between transition duration-300 hover:shadow-2xl">
                        <div>
                            <span className="font-semibold text-lg">{result.subject}</span>
                            <p className={`text-sm ${result.status === 'Declared' ? 'text-green-600' : 'text-yellow-600'}`}>
                                {result.status}
                            </p>
                        </div>
                        {result.status === 'Declared' ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-xl font-bold text-blue-600">{result.score}</span>
                                <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                                    <ChevronRight className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        ) : (
                            <span className="text-sm text-gray-400">Unavailable</span>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}