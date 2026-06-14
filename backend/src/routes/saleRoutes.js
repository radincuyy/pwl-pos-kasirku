const express = require('express');

const {
  getSales,
  getSaleById,
  createSale
} = require('../controllers/saleController');
const authMiddleware = require('../middlewares/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.use(authMiddleware);

router.get('/', asyncHandler(getSales));
router.get('/:id', asyncHandler(getSaleById));
router.post('/', asyncHandler(createSale));

module.exports = router;
