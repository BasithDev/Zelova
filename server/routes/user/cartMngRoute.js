const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/user/cartMng');

// Get full cart details
router.get('/', cartController.getCart);

// Add/Update/Remove cart item
router.post('/update', cartController.updateCartItem);

// Remove item from cart
router.delete('/:cartId/items/:itemId', cartController.removeItemFromCart);

module.exports = router;