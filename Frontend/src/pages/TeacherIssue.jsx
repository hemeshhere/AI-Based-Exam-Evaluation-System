import React, { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const initialIssues = [
  {
    id: 1,
    student: 'Amit Kumar',
    message: 'My exam answers were not submitted properly.',
    date: '2025-07-12',
    status: 'Pending',
    reply: '',
    type: 'Exam',
  },
  {
    id: 2,
    student: 'Sneha Sharma',
    message: 'Feedback is not visible on my dashboard.',
    date: '2025-07-10',
    status: 'Resolved',
    reply: 'Feedback has been updated.',
    type: 'Feedback',
  },
  {
    id: 3,
    student: 'Rahul Verma',
    message: 'Cannot access the exam page.',
    date: '2025-07-09',
    status: 'Pending',
    reply: '',
    type: 'Technical',
  },
  {
    id: 4,
    student: 'Anjali Singh',
    message: 'Submitted answers are not visible.',
    date: '2025-07-08',
    status: 'Pending',
    reply: '',
    type: 'Exam',
  },
];

const statusStyles = {
  Pending: 'text-yellow-600 bg-yellow-100',
  Resolved: 'text-green-600 bg-green-100',
};

const typeStyles = {
  Exam: 'bg-blue-100 text-blue-600',
  Feedback: 'bg-purple-100 text-purple-600',
  Technical: 'bg-red-100 text-red-600',
};

const TeacherIssue = () => {
  const [issues, setIssues] = useState(initialIssues);
  const [expandedId, setExpandedId] = useState(null);
  const [replyInputs, setReplyInputs] = useState({});
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const issuesPerPage = 2;

  const toggleDropdown = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
    const currentReply = issues.find((issue) => issue.id === id)?.reply || '';
    setReplyInputs((prev) => ({ ...prev, [id]: currentReply }));
  };

  const handleReplyChange = (id, value) => {
    setReplyInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleReplySubmit = (id) => {
    if (!window.confirm('Are you sure you want to submit this reply?')) return;
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === id
          ? {
              ...issue,
              reply: replyInputs[id],
              status: 'Resolved',
            }
          : issue
      )
    );
    setExpandedId(null);
  };

  const filteredIssues =
    statusFilter === 'All'
      ? issues
      : issues.filter((issue) => issue.status === statusFilter);

  // PAGINATION
  const totalPages = Math.ceil(filteredIssues.length / issuesPerPage);
  const paginatedIssues = filteredIssues.slice(
    (currentPage - 1) * issuesPerPage,
    currentPage * issuesPerPage
  );

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="w-full p-6 md:p-10">
      <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2 mb-6">
        <AlertCircle className="text-red-500" size={28} />
        Reported Issues
      </h2>

      {/* Filter */}
      <div className="flex flex-wrap gap-3 mb-6">
        {['All', 'Pending', 'Resolved'].map((status) => (
          <button
            key={status}
            className={`px-4 py-1 rounded-full text-sm border ${
              statusFilter === status
                ? 'bg-blue-600 text-white border-blue-600'
                : 'text-blue-600 border-blue-300'
            }`}
            onClick={() => {
              setStatusFilter(status);
              setCurrentPage(1); // reset to first page
            }}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {paginatedIssues.map((issue) => (
          <div
            key={issue.id}
            className="bg-white shadow-md border border-gray-200 rounded-xl p-6"
          >
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shadow">
                  {issue.student
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </div>
                <div>
                  <div className="flex gap-2 items-center">
                    <p className="text-lg font-semibold text-gray-800">
                      {issue.student}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${typeStyles[issue.type]}`}
                    >
                      {issue.type}
                    </span>
                    {issue.status === 'Resolved' && (
                      <CheckCircle className="text-green-500" size={18} />
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{issue.message}</p>
                  <p className="text-gray-400 text-xs mt-1">Reported on: {issue.date}</p>
                  {issue.reply && (
                    <div className="mt-3 bg-green-50 text-green-700 p-3 rounded-md text-sm">
                      <strong>Reply:</strong> {issue.reply}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full ${statusStyles[issue.status]}`}
                >
                  {issue.status}
                </span>
                <button
                  className="flex items-center gap-1 text-blue-600 hover:underline text-sm"
                  onClick={() => toggleDropdown(issue.id)}
                >
                  {issue.reply ? 'Update Reply' : 'Reply'}
                  {expandedId === issue.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {expandedId === issue.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4">
                    <textarea
                      rows={3}
                      className="w-full border border-gray-300 rounded-md p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Type your reply here..."
                      value={replyInputs[issue.id] || ''}
                      onChange={(e) => handleReplyChange(issue.id, e.target.value)}
                    />
                    <div className="text-right mt-2">
                      <button
                        onClick={() => handleReplySubmit(issue.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm shadow transition"
                      >
                        {issue.reply ? 'Update Reply' : 'Submit Reply'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center gap-4 mt-10">
        <button
          onClick={goToPrevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg border text-sm ${
            currentPage === 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white text-blue-600 hover:bg-blue-50 border-blue-300'
          }`}
        >
          Previous
        </button>
        <span className="text-sm text-gray-600 self-center">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg border text-sm ${
            currentPage === totalPages
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white text-blue-600 hover:bg-blue-50 border-blue-300'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TeacherIssue;
