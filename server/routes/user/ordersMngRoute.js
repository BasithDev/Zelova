const express = require('express');
const router = express.Router();
const { placeOrder } = require('../../controllers/user/ordersMng');

router.post('/place-order', placeOrder);

module.exports = router;