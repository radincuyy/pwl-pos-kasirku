const express = require('express');

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/authorizeRoles');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.use(authMiddleware);

router.get('/', authorizeRoles('admin', 'kasir', 'owner'), asyncHandler(getProducts));
router.get('/:id', authorizeRoles('admin', 'kasir', 'owner'), asyncHandler(getProductById));
router.post('/', authorizeRoles('admin'), asyncHandler(createProduct));
router.put('/:id', authorizeRoles('admin'), asyncHandler(updateProduct));
router.delete('/:id', authorizeRoles('admin'), asyncHandler(deleteProduct));

module.exports = router;
