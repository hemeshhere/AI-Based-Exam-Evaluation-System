// Import Express framework and create an Express app instance
const express = require('express');
const app = express();
app.use(express.json());
// Import and use exam-related routes under /api/exam
const examRoutes = require('./routes/examRoutes');
app.use('/api/exam', examRoutes);

// Import and use question-related routes under /api/question
const questionRoutes = require('./routes/questionRoutes');
app.use('/api/question', questionRoutes);

//auth routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
  

const mongoose = require('mongoose');
require('dotenv').config();


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected ✅');
}).catch((err) => {
  console.error('MongoDB connection error:', err.message);
});

// Start the server on the specified port
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
