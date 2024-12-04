const express = require('express');
const router = express.Router();
const { placeOrder, getCurrentOrders, updateOrderStatus, getPreviousOrdersOnDate } = require('../../controllers/user/ordersMng');

router.post('/place-order', placeOrder);
router.get('/current',getCurrentOrders)
router.patch('/update-status',updateOrderStatus)
router.get('/previous/:date',getPreviousOrdersOnDate)

module.exports = router;