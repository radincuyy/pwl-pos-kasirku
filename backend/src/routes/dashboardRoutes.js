const express = require('express');

const {
  getCashierSummary,
  getSummary
} = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/authorizeRoles');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.use(authMiddleware);

router.get('/summary', authorizeRoles('admin', 'owner'), asyncHandler(getSummary));
router.get('/cashier-summary', authorizeRoles('kasir'), asyncHandler(getCashierSummary));

module.exports = router;
