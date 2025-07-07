import React from 'react';

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg hidden md:flex flex-col justify-between">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600 mb-8">Student Portal</h1>
          <nav className="space-y-2">
            <a href="#profile" className="flex items-center gap-3 px-4 py-3 text-gray-700 font-medium rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-300">
              <span>Profile</span>
            </a>
            <a href="#timetable" className="flex items-center gap-3 px-4 py-3 text-gray-700 font-medium rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-300">
              <span>Timetable</span>
            </a>
            <a href="#exam" className="flex items-center gap-3 px-4 py-3 text-gray-700 font-medium rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-300">
              <span>Exam</span>
            </a>
            <a href="#result" className="flex items-center gap-3 px-4 py-3 text-gray-700 font-medium rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-300">
              <span>Result</span>
            </a>
            <a href="#issue" className="flex items-center gap-3 px-4 py-3 text-gray-700 font-medium rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-300">
              <span>Raise Issue</span>
            </a>
          </nav>
        </div>
        <div className="p-6">
          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition duration-200">
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-md p-4 flex justify-between items-center md:hidden sticky top-0 z-10">
          <h1 className="text-xl font-bold text-blue-600">Student Portal</h1>
        </header>

        <main className="flex-1 p-4 md:p-8 space-y-12">

          {/* Profile */}
          <section id="profile">
            <h2 className="text-3xl font-bold mb-6 text-gray-700">My Profile</h2>
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0 flex flex-col items-center gap-4">
                <img className="w-32 h-32 rounded-full object-cover border-4 border-blue-200" src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" />
                <button className="px-4 py-2 text-sm font-semibold bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">Change Picture</button>
              </div>
              <div className="w-full border-t md:border-t-0 md:border-l border-gray-200 pt-6 md:pt-0 md:pl-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  <div><strong className="text-gray-500">Name:</strong><p className="text-lg">John Doe</p></div>
                  <div><strong className="text-gray-500">Class:</strong><p className="text-lg">10th A</p></div>
                  <div><strong className="text-gray-500">Roll No:</strong><p className="text-lg">23</p></div>
                  <div><strong className="text-gray-500">Email:</strong><p className="text-lg">john.doe@example.com</p></div>
                </div>
              </div>
            </div>
          </section>

          {/* Timetable */}
          <section id="timetable">
            <h2 className="text-3xl font-bold mb-6 text-gray-700">Exam Timetable</h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl">
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
                    <td className="p-4 text-center"><span className="px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">Completed</span></td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-4">2024-10-28</td>
                    <td className="p-4 font-medium text-blue-600">Physics</td>
                    <td className="p-4 text-center"><span className="px-3 py-1 text-xs font-semibold text-orange-800 bg-orange-100 rounded-full">Upcoming</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Exam */}
          <section id="exam">
            <h2 className="text-3xl font-bold mb-6 text-gray-700">Ongoing Exam: Physics</h2>
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Question 1 of 20</p>
                  <p className="text-lg font-semibold mt-1">What is Newton's second law of motion?</p>
                </div>
                <div className="flex-shrink-0 px-4 py-2 bg-red-100 text-red-700 font-bold rounded-lg">14:32</div>
              </div>
              <div>
                <label htmlFor="answer" className="block text-sm font-medium text-gray-600 mb-2">Your Answer:</label>
                <textarea id="answer" rows="5" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Type your answer here..."></textarea>
              </div>
              <div className="flex justify-between items-center">
                <button className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">Previous</button>
                <button className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">Next</button>
              </div>
            </div>
          </section>

          {/* Results */}
          <section id="result">
            <h2 className="text-3xl font-bold mb-6 text-gray-700">Results</h2>
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl space-y-4">
              <div className="flex justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <span className="font-medium">1. Mathematics</span>
                <button className="px-4 py-1 text-sm font-semibold bg-white border border-gray-300 rounded-md hover:bg-gray-100">Show Score</button>
              </div>
              <div className="flex justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <span className="font-medium">2. English Literature</span>
                <button className="px-4 py-1 text-sm font-semibold bg-white border border-gray-300 rounded-md hover:bg-gray-100">Show Score</button>
              </div>
              <div className="flex justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <span className="font-medium text-gray-400">3. Physics</span>
                <span className="text-sm text-gray-400">Not Declared Yet</span>
              </div>
            </div>
          </section>

          {/* Raise Issue */}
          <section id="issue">
            <h2 className="text-3xl font-bold mb-6 text-gray-700">Raise an Issue</h2>
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl">
              <form className="space-y-6">
                <div>
                  <label htmlFor="issue-subject" className="block text-sm font-medium text-gray-600 mb-2">Subject</label>
                  <input type="text" id="issue-subject" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g., Error in result scorecard" />
                </div>
                <div>
                  <label htmlFor="issue-description" className="block text-sm font-medium text-gray-600 mb-2">Description</label>
                  <textarea id="issue-description" rows="5" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Describe your issue..."></textarea>
                </div>
                <div className="flex justify-end gap-4">
                  <button type="reset" className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">Clear</button>
                  <button type="submit" className="px-6 py-2 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700">Submit Issue</button>
                </div>
              </form>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
