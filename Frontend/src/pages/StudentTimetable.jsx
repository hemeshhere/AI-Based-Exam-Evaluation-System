// src/pages/StudentTimetable.jsx
import React from 'react';

export default function StudentTimetable() {
	return (
		<section id="timetable">
			<h2 className="text-3xl font-bold mb-6 text-gray-700">Exam Timetable</h2>
			<div className="bg-white rounded-xl shadow-lg overflow-hidden transition duration-300 hover:shadow-2xl">
				<div className="overflow-x-auto">
					<table className="w-full text-left">
						<thead className="bg-gray-100 border-b border-gray-200">
							<tr>
								<th className="p-4 font-semibold">Date</th>
								<th className="p-4 font-semibold">Subject</th>
								<th className="p-4 font-semibold text-center">Status</th>
							</tr>
						</thead>
						<tbody>
							<tr className="border-b border-gray-200 hover:bg-gray-50">
								<td className="p-4">2024-10-26</td>
								<td className="p-4 font-medium text-blue-600">Mathematics</td>
								<td className="p-4 text-center">
									<span className="px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
										Completed
									</span>
								</td>
							</tr>
							<tr className="border-b border-gray-200 hover:bg-gray-50">
								<td className="p-4">2024-10-28</td>
								<td className="p-4 font-medium text-blue-600">Physics</td>
								<td className="p-4 text-center">
									<span className="px-3 py-1 text-xs font-semibold text-orange-800 bg-orange-100 rounded-full">
										Upcoming
									</span>
								</td>
							</tr>
							<tr className="hover:bg-gray-50">
								<td className="p-4">2024-10-30</td>
								<td className="p-4 font-medium text-blue-600">Chemistry</td>
								<td className="p-4 text-center">
									<span className="px-3 py-1 text-xs font-semibold text-orange-800 bg-orange-100 rounded-full">
										Upcoming
									</span>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</section>
	);
}
