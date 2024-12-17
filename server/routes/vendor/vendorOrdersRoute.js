const express = require('express');
const { getCurrentOrdersForVendor,updateOrderStatus, getPreviousOrdersOnDate } = require('../../controllers/vendor/vendorOrdersController');
const router = express.Router();

router.get('/current',getCurrentOrdersForVendor)
router.patch('/update-status',updateOrderStatus)
router.get('/previous/:date',getPreviousOrdersOnDate)

module.exports = router;