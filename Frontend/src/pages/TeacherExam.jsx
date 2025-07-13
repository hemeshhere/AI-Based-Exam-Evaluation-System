import React, { useState } from 'react';
import axios from 'axios';
import { Plus } from 'lucide-react';

const TeacherExam = () => {
  const [subject, setSubject] = useState('');
  const [numQuestions, setNumQuestions] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submittedPapers, setSubmittedPapers] = useState([]);

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const generateQuestionFields = () => {
    if (!subject.trim() || numQuestions < 1) {
      return alert("Please enter subject and a valid question count.");
    }

    const newQuestions = Array.from({ length: numQuestions }, () => ({
      type: 'subjective',
      question: '',
      marks: '',
      options: ['', '', '', '']
    }));
    setQuestions(newQuestions);
    setCurrentIndex(0);
  };

  const handleSubmit = async () => {
    if (!subject || questions.length === 0) return alert("Subject and questions are required.");

    try {
      const payload = { subject, questions };
      const res = await axios.post('http://localhost:5000/api/questions', payload);

      if (res.status === 201) {
        setSubmittedPapers([...submittedPapers, payload]);
        setSubject('');
        setNumQuestions(0);
        setQuestions([]);
        setCurrentIndex(0);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload. Check console for details.');
    }
  };

  const handleNew = () => {
    setSubject('');
    setNumQuestions(0);
    setQuestions([]);
    setCurrentIndex(0);
  };

  const currentQuestion = questions[currentIndex];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-indigo-700">📘 Exam Dashboard</h2>
        <button
          onClick={handleNew}
          className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-md hover:bg-indigo-200 flex items-center gap-2"
        >
          <Plus size={18} /> New
        </button>
      </div>

      {/* Form Section */}
      <div className="bg-white p-6 rounded-lg shadow-md border space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Subject</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="e.g., Chemistry"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Number of Questions</label>
            <input
              type="number"
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              className="w-full border border-gray-300 p-2 rounded"
              min={1}
            />
          </div>
        </div>

        <button
          onClick={generateQuestionFields}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Generate Questions
        </button>

        {/* Question Navigator */}
        {questions.length > 0 && (
          <div className="space-y-4">
            <div className="border border-gray-300 p-4 rounded bg-gray-50">
              <h4 className="font-semibold text-lg text-gray-700">Question {currentIndex + 1} of {questions.length}</h4>

              <div>
                <label className="block text-sm mb-1">Type</label>
                <select
                  value={currentQuestion.type}
                  onChange={(e) => handleQuestionChange(currentIndex, 'type', e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="subjective">Subjective</option>
                  <option value="mcq">MCQ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Question Text</label>
                <input
                  value={currentQuestion.question}
                  onChange={(e) => handleQuestionChange(currentIndex, 'question', e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter question"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Marks</label>
                <input
                  type="number"
                  value={currentQuestion.marks}
                  onChange={(e) => handleQuestionChange(currentIndex, 'marks', e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="e.g. 5"
                />
              </div>

              {currentQuestion.type === 'mcq' && (
                <div>
                  <label className="block text-sm mb-1">Options</label>
                  {currentQuestion.options.map((opt, idx) => (
                    <input
                      key={idx}
                      value={opt}
                      onChange={(e) => handleOptionChange(currentIndex, idx, e.target.value)}
                      className="w-full mb-2 p-2 border rounded"
                      placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                disabled={currentIndex === 0}
              >
                Previous
              </button>

              {currentIndex === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Upload Paper
                </button>
              ) : (
                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1))}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Uploaded Papers */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">📑 Uploaded Papers</h3>

        {submittedPapers.length === 0 ? (
          <p className="text-gray-500 italic">No papers uploaded yet.</p>
        ) : (
          <div className="grid gap-4">
            {submittedPapers.map((paper, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg shadow p-4">
                <h4 className="text-lg font-semibold text-blue-700 mb-2">{paper.subject}</h4>
                {paper.questions.map((q, qIdx) => (
                  <div key={qIdx} className="mb-2">
                    <p className="text-gray-800">
                      <span className="font-medium">Q{qIdx + 1}:</span> {q.question} ({q.marks} marks)
                    </p>
                    {q.type === 'mcq' && (
                      <ul className="list-disc ml-6 text-sm text-gray-600">
                        {q.options.map((opt, oIdx) => (
                          <li key={oIdx}>➤ {opt}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherExam;
