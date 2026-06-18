const express = require('express');

const {
  getSales,
  getSaleById,
  createSale
} = require('../controllers/saleController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/authorizeRoles');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.use(authMiddleware);

router.get('/', authorizeRoles('admin', 'kasir', 'owner'), asyncHandler(getSales));
router.get('/:id', authorizeRoles('admin', 'kasir', 'owner'), asyncHandler(getSaleById));
router.post('/', authorizeRoles('admin', 'kasir'), asyncHandler(createSale));

module.exports = router;
