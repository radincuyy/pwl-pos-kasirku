const express = require('express');

const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/authorizeRoles');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.use(authMiddleware);

router.get('/', authorizeRoles('admin', 'owner'), asyncHandler(getCategories));
router.get('/:id', authorizeRoles('admin', 'owner'), asyncHandler(getCategoryById));
router.post('/', authorizeRoles('admin'), asyncHandler(createCategory));
router.put('/:id', authorizeRoles('admin'), asyncHandler(updateCategory));
router.delete('/:id', authorizeRoles('admin'), asyncHandler(deleteCategory));

module.exports = router;
