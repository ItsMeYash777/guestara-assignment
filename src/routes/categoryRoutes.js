const express = require('express');
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  getCategoryByIdOrName,
  updateCategory,
} = require('../apis/categoryApi');

const { createSubCategory, getSubCategoriesByCategory } = require('../apis/subCategoryApi');
const { getItemsByCategory } = require('../apis/itemsApi');

// Category routes
router.post('/', createCategory);
router.get('/', getAllCategories);
router.get('/:id', getCategoryByIdOrName);
router.patch('/:id', updateCategory);

// SubCategory routes under category
router.post('/:categoryId/subcategories', createSubCategory);
router.get('/:categoryId/subcategories', getSubCategoriesByCategory);

// Item routes under category
router.get('/:categoryId/items', getItemsByCategory);

module.exports = router;

