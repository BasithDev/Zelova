const express = require('express');
const router = express.Router();
const {getUsers} = require('../../controllers/admin/userMngController')
const {getVendors} = require('../../controllers/admin/vendorMngController')
const {getVendorApplications} = require('../../controllers/admin/requestMngController')
router.get('/users',getUsers)
router.get('/vendors',getVendors)
router.get('/requests',getVendorApplications)
module.exports = router