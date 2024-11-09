const express = require('express');
const router = express.Router();
const {submitReqVendor} = require('../../controllers/user/reqVendorController')
const authValidator = require('../../middlewares/authValidator')
router.post('/',submitReqVendor)

module.exports = router;