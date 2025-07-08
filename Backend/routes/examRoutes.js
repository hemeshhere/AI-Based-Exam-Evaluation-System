const express = require('express');
const router = express.Router();
const { createExam } = require('../controllers/examController');
const auth = require('../middlewares/authMiddleware');

router.post('/', auth, createExam);

module.exports = router;
