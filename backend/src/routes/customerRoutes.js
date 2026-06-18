const express = require('express');

const {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
} = require('../controllers/customerController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/authorizeRoles');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.use(authMiddleware);

router.get('/', authorizeRoles('admin', 'kasir', 'owner'), asyncHandler(getCustomers));
router.get('/:id', authorizeRoles('admin', 'kasir', 'owner'), asyncHandler(getCustomerById));
router.post('/', authorizeRoles('admin', 'kasir'), asyncHandler(createCustomer));
router.put('/:id', authorizeRoles('admin', 'kasir'), asyncHandler(updateCustomer));
router.delete('/:id', authorizeRoles('admin', 'kasir'), asyncHandler(deleteCustomer));

module.exports = router;
