const express = require('express');
const router = express.Router();
const {getUsers, blockUnblockUser} = require('../../controllers/admin/userManagementController')
const {getVendors, blockUnblockVendor} = require('../../controllers/admin/vendorManagementController')
const {getVendorApplications,acceptReq,denyReq, deleteImage, getVendorPendingRequestsCount} = require('../../controllers/admin/requestManagementController');
const { generateDeleteSignature } = require('../../controllers/admin/signatureGenerationDeletion');
const { getCategories, getSubCategories, deleteCategory, deleteSubCategory } = require('../../controllers/admin/categoryManagement');
router.get('/users',getUsers)
router.get('/vendors',getVendors)
router.get('/requests',getVendorApplications)
router.post('/accept-vendor/:id',acceptReq)
router.post('/deny-vendor/:id',denyReq)
router.get('/requests-count',getVendorPendingRequestsCount)
router.get('/delete-signature',generateDeleteSignature)
router.patch('/block-unblock-user/:userId',blockUnblockUser)
router.patch('/block-unblock-vendor/:vendorId',blockUnblockVendor)
router.post('/delete-image', deleteImage);
router.get('/categories',getCategories)
router.get('/subcategories',getSubCategories)
router.delete('/category/delete/:id',deleteCategory)
router.delete('/subcategory/delete/:id',deleteSubCategory)
module.exports = router