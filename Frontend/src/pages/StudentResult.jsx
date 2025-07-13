// src/pages/StudentResult.jsx
import React from 'react';

export default function StudentResult() {
	return (
		<section id="result">
			<h2 className="text-3xl font-bold mb-6 text-gray-700">Results</h2>
			<div className="bg-white rounded-xl shadow-lg p-8 transition duration-300 hover:shadow-2xl space-y-4">
				<div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
					<span className="font-medium">1. Mathematics</span>
					<button className="px-4 py-1 text-sm font-semibold bg-white border border-gray-300 rounded-md hover:bg-gray-100">
						Show Score
					</button>
				</div>
				<div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
					<span className="font-medium">2. English Literature</span>
					<button className="px-4 py-1 text-sm font-semibold bg-white border border-gray-300 rounded-md hover:bg-gray-100">
						Show Score
					</button>
				</div>
				<div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
					<span className="font-medium text-gray-400">3. Physics</span>
					<span className="text-sm text-gray-400">Not Declared Yet</span>
				</div>
			</div>
		</section>
	);
}
