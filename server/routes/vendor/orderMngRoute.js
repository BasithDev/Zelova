const express = require('express');
const { getCurrentOrdersForVendor } = require('../../controllers/vendor/orderMng');
const router = express.Router();

router.get('/current',getCurrentOrdersForVendor)

module.exports = router;