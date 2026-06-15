const express = require('express');

const {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
} = require('../controllers/customerController');
const authMiddleware = require('../middlewares/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.use(authMiddleware);

router.get('/', asyncHandler(getCustomers));
router.get('/:id', asyncHandler(getCustomerById));
router.post('/', asyncHandler(createCustomer));
router.put('/:id', asyncHandler(updateCustomer));
router.delete('/:id', asyncHandler(deleteCustomer));

module.exports = router;
