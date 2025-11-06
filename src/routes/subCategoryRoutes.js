const express = require('express');
const router = express.Router();
const {
  getAllSubCategories,
  getSubCategoryByIdOrName,
  updateSubCategory,
} = require('../apis/subCategoryApi');

const { getItemsBySubCategory } = require('../apis/itemsApi');


// Sub-category routes
router.get('/', getAllSubCategories);
router.get('/:id', getSubCategoryByIdOrName);
router.patch('/:id', updateSubCategory);

// Item routes under subcategory
router.get('/:subCategoryId/items', getItemsBySubCategory);

module.exports = router;


