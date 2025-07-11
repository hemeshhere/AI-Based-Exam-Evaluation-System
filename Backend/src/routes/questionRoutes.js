const express = require('express');
const router = express.Router();
const { addQuestion } = require('../controllers/questionController');
const auth = require('../middlewares/authMiddleware');

router.post('/:examId/questions', auth, addQuestion);

module.exports = router;
