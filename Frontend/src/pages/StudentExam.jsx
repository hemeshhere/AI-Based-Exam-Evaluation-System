// src/pages/StudentExam.jsx
import React from 'react';

export default function StudentExam() {
	return (
		<section id="exam">
			<h2 className="text-3xl font-bold mb-6 text-gray-700">Ongoing Exam: Physics</h2>
			<div className="bg-white rounded-xl shadow-lg p-8 transition duration-300 hover:shadow-2xl space-y-6">
				<div className="flex justify-between items-start">
					<div>
						<p className="text-sm text-gray-500">Question 1 of 20</p>
						<p className="text-lg font-semibold mt-1">
							What is Newton's second law of motion?
						</p>
					</div>
					<div className="flex-shrink-0 px-4 py-2 bg-red-100 text-red-700 font-bold rounded-lg">
						14:32
					</div>
				</div>
				<div>
					<label htmlFor="answer" className="block text-sm font-medium text-gray-600 mb-2">
						Your Answer:
					</label>
					<textarea
						id="answer"
						rows="5"
						className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
						placeholder="Type your answer here..."
					></textarea>
				</div>
				<div className="flex justify-between items-center">
					<button className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">
						Previous Question
					</button>
					<button className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
						Next Question
					</button>
				</div>
			</div>
		</section>
	);
}
