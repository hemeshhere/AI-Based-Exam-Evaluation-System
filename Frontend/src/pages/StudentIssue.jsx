// src/pages/StudentIssue.jsx
import React from 'react';

export default function StudentIssue() {
	return (
		<section id="issue">
			<h2 className="text-3xl font-bold mb-6 text-gray-700">Raise an Issue</h2>
			<div className="bg-white rounded-xl shadow-lg p-8 transition duration-300 hover:shadow-2xl">
				<form className="space-y-6">
					<div>
						<label htmlFor="issue-subject" className="block text-sm font-medium text-gray-600 mb-2">
							Subject
						</label>
						<input
							type="text"
							id="issue-subject"
							className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
							placeholder="e.g., Error in result scorecard"
						/>
					</div>
					<div>
						<label htmlFor="issue-description" className="block text-sm font-medium text-gray-600 mb-2">
							Description
						</label>
						<textarea
							id="issue-description"
							rows="5"
							className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
							placeholder="Please describe your issue in detail..."
						></textarea>
					</div>
					<div className="flex justify-end gap-4">
						<button type="reset" className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">
							Clear
						</button>
						<button type="submit" className="px-6 py-2 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700">
							Submit Issue
						</button>
					</div>
				</form>
			</div>
		</section>
	);
}
