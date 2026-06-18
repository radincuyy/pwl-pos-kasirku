const express = require('express');

const {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
} = require('../controllers/supplierController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/authorizeRoles');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.use(authMiddleware);

router.get('/', authorizeRoles('admin', 'owner'), asyncHandler(getSuppliers));
router.get('/:id', authorizeRoles('admin', 'owner'), asyncHandler(getSupplierById));
router.post('/', authorizeRoles('admin'), asyncHandler(createSupplier));
router.put('/:id', authorizeRoles('admin'), asyncHandler(updateSupplier));
router.delete('/:id', authorizeRoles('admin'), asyncHandler(deleteSupplier));

module.exports = router;
