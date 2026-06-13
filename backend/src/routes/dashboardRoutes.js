const express = require('express');
const { getDashboardSummary } = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/summary', authMiddleware, asyncHandler(getDashboardSummary));

module.exports = router;
