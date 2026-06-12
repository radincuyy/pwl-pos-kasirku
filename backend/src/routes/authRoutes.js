const express = require('express');

const { login, getMe, logout } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.post('/login', asyncHandler(login));
router.get('/me', authMiddleware, asyncHandler(getMe));
router.post('/logout', authMiddleware, logout);

module.exports = router;
