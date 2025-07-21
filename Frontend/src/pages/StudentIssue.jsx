import React from 'react';
import { AlertCircle, Send, Clock } from 'lucide-react';

const previousIssues = [
    { id: 1, subject: 'Error in result scorecard', status: 'Resolved' },
    { id: 2, subject: 'Unable to access study material', status: 'Pending' }
];

export default function StudentIssue() {
    return (
        <section id="issue">
            <h2 className="text-3xl font-bold mb-6 text-gray-700">Raise an Issue</h2>
            <div className="bg-white rounded-xl shadow-lg p-8 transition duration-300 hover:shadow-2xl">
                <form className="space-y-6">
                    <div className="relative">
                        <label htmlFor="issue-subject" className="block text-sm font-medium text-gray-600 mb-2">Subject</label>
                        <input
                            type="text"
                            id="issue-subject"
                            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Error in result scorecard"
                        />
                        <AlertCircle className="absolute left-3 top-10 w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                        <label htmlFor="issue-description" className="block text-sm font-medium text-gray-600 mb-2">Description</label>
                        <textarea
                            id="issue-description"
                            rows="5"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Please describe your issue in detail..."
                        ></textarea>
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="flex items-center gap-2 px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                            <Send className="w-5 h-5" />
                            Submit Issue
                        </button>
                    </div>
                </form>
            </div>

            <div className="mt-10">
                <h3 className="text-2xl font-bold mb-4 text-gray-700">Previous Issues</h3>
                <div className="space-y-4">
                    {previousIssues.map(issue => (
                        <div key={issue.id} className="bg-white rounded-xl shadow-lg p-4 flex items-center justify-between">
                            <p className="font-medium">{issue.subject}</p>
                            <span className={`flex items-center gap-2 text-sm px-3 py-1 rounded-full ${issue.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                <Clock className="w-4 h-4" />
                                {issue.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}