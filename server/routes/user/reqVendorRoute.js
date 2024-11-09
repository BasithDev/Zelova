const express = require('express');
const router = express.Router();
const {submitReqVendor} = require('../../controllers/user/reqVendorController')
router.post('/',submitReqVendor)

module.exports = router;