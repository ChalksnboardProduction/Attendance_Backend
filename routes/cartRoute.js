const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Get all carts
router.get('/', cartController.getAllCarts);

// Get cart by ID
router.get('/:id', cartController.getCartById);

// Create cart
router.post('/', cartController.createCart);

// Update cart
router.put('/:id', cartController.updateCart);

// Delete cart
router.delete('/:id', cartController.deleteCart);

module.exports = router; 