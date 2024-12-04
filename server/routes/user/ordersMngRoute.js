const express = require('express');
const router = express.Router();
const { placeOrder, getCurrentOrders, updateOrderStatus, getPreviousOrdersOnDate ,createRazorpayOrder , verifyRazorpayPayment } = require('../../controllers/user/ordersMng');

router.post('/place-order', placeOrder);
router.get('/current',getCurrentOrders)
router.patch('/update-status',updateOrderStatus)
router.get('/previous/:date',getPreviousOrdersOnDate)
router.post('/create-razorpay-order', createRazorpayOrder);
router.post('/verify-razorpay-payment', verifyRazorpayPayment);

module.exports = router;