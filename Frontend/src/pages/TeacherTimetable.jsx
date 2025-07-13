import React, { useState } from 'react';

const TeacherTimetable = () => {
  const [form, setForm] = useState({
    subject: '',
    section: '',
    date: '',
    startTime: '',
    endTime: '',
  });

  const [timetable, setTimetable] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.subject || !form.section || !form.date || !form.startTime || !form.endTime) {
      alert('Please fill all fields.');
      return;
    }

    setTimetable([...timetable, form]);
    setForm({ subject: '', section: '', date: '', startTime: '', endTime: '' });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">📅 Exam Timetable</h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-lg p-6 shadow-md grid gap-4 md:grid-cols-2"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Subject Name</label>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
            placeholder="e.g., Physics"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Class / Section</label>
          <input
            type="text"
            name="section"
            value={form.section}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
            placeholder="e.g., 10-A"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div className="flex gap-2">
          <div className="w-1/2">
            <label className="block text-sm font-medium mb-1">Start Time</label>
            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium mb-1">End Time</label>
            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Add to Timetable
          </button>
        </div>
      </form>

      {/* Display Timetable */}
      {timetable.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">📘 Scheduled Exams</h3>
          <div className="space-y-4">
            {timetable.map((item, index) => (
              <div
                key={index}
                className="bg-white border p-4 rounded shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-gray-800">{item.subject}</p>
                  <p className="text-sm text-gray-600">
                    Class: {item.section} | {item.date}
                  </p>
                  <p className="text-sm text-gray-500">
                    Time: {item.startTime} - {item.endTime}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherTimetable;
