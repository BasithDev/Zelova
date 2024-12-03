const express = require('express');
const router = express.Router();
const { placeOrder, getCurrentOrders } = require('../../controllers/user/ordersMng');

router.post('/place-order', placeOrder);
router.get('/current',getCurrentOrders)

module.exports = router;