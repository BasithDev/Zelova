const express = require('express');
const router = express.Router();
const {getUsers, blockUnblockUser} = require('../../controllers/admin/userMngController')
const {getVendors} = require('../../controllers/admin/vendorMngController')
const {getVendorApplications,acceptReq,denyReq, deleteImage} = require('../../controllers/admin/requestMngController');
const { generateDeleteSignature } = require('../../controllers/admin/genDelSign');
router.get('/users',getUsers)
router.get('/vendors',getVendors)
router.get('/requests',getVendorApplications)
router.post('/accept-vendor/:id',acceptReq)
router.post('/deny-vendor/:id',denyReq)
router.patch('/block-unblock-user/:userId',blockUnblockUser)
router.post('/delete-image', deleteImage);
module.exports = router