const express = require('express');
const router = express.Router();
const {getUsers} = require('../../controllers/admin/userMngController')
const {getVendors} = require('../../controllers/admin/vendorMngController')
router.get('/get-users',getUsers)
router.get('/get-vendors',getVendors)
module.exports = router