const express = require('express');
const router = express.Router();
const {
  createItem,
  getAllItems,
  getItemByIdOrName,
  searchItems,
  updateItem,
} = require('../apis/itemsApi');

// Item routes
router.post('/', createItem); 
router.get('/', getAllItems);
router.get('/search', searchItems);
router.get('/:id', getItemByIdOrName);
router.patch('/:id', updateItem);

module.exports = router;





