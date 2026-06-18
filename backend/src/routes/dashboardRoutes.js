const express = require('express');

const { getSummary } = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.use(authMiddleware);

router.get('/summary', asyncHandler(getSummary));

module.exports = router;
