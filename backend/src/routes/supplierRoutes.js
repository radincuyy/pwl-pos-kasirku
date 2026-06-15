const express = require('express');

const {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
} = require('../controllers/supplierController');
const authMiddleware = require('../middlewares/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.use(authMiddleware);

router.get('/', asyncHandler(getSuppliers));
router.get('/:id', asyncHandler(getSupplierById));
router.post('/', asyncHandler(createSupplier));
router.put('/:id', asyncHandler(updateSupplier));
router.delete('/:id', asyncHandler(deleteSupplier));

module.exports = router;
