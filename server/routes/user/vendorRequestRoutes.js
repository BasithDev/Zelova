const express = require('express');
const router = express.Router();
const {submitReqVendor} = require('../../controllers/user/vendorRequestController')
router.post('/',submitReqVendor)

module.exports = router;