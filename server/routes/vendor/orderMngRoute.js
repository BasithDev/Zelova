const express = require('express');
const { getCurrentOrdersForVendor,updateOrderStatus } = require('../../controllers/vendor/ordersMng');
const router = express.Router();

router.get('/current',getCurrentOrdersForVendor)
router.patch('/update-status',updateOrderStatus)

module.exports = router;