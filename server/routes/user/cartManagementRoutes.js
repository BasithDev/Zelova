const express = require('express');
const router = express.Router();
const { 
    getCart, 
    getTotalItemsFromCart, 
    getTotalPriceFromCart,
    updateCart,
    generateDeliveryFee
} = require('../../controllers/user/cartManagementController');

router.get('/', getCart);
router.get('/total-items', getTotalItemsFromCart);
router.get('/total-price', getTotalPriceFromCart);
router.put('/update', updateCart);
router.get('/delivery-fee',generateDeliveryFee)

module.exports = router;