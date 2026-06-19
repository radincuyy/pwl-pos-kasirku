const express = require('express');

const {
  getHealth,
  getReadiness
} = require('../controllers/healthController');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/', getHealth);
router.get('/ready', asyncHandler(getReadiness));

module.exports = router;
