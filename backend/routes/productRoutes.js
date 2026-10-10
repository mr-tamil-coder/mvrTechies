const express = require('express');
const router = express.Router();
const {
  getProducts,
  createProduct,
  updateProduct,
  updateProductPrice,
  deleteProduct,
  seedDatabase
} = require('../controllers/productController');

router.get('/', getProducts);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.put('/:id/price', updateProductPrice);
router.delete('/:id', deleteProduct);
router.post('/seed', seedDatabase);

module.exports = router;
