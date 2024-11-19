const express = require('express');
const router = express.Router();
const {getUsers, blockUnblockUser} = require('../../controllers/admin/userMngController')
const {getVendors, blockUnblockVendor} = require('../../controllers/admin/vendorMngController')
const {getVendorApplications,acceptReq,denyReq, deleteImage} = require('../../controllers/admin/requestMngController');
const { generateDeleteSignature } = require('../../controllers/admin/genDelSign');
const { getCategories, getSubCategories, deleteCategory, deleteSubCategory } = require('../../controllers/admin/categoriesMng');
router.get('/users',getUsers)
router.get('/vendors',getVendors)
router.get('/requests',getVendorApplications)
router.post('/accept-vendor/:id',acceptReq)
router.post('/deny-vendor/:id',denyReq)
router.patch('/block-unblock-user/:userId',blockUnblockUser)
router.patch('/block-unblock-vendor/:vendorId',blockUnblockVendor)
router.post('/delete-image', deleteImage);
router.get('/categories',getCategories)
router.get('/subcategories',getSubCategories)
router.delete('/category/delete/:id',deleteCategory)
router.delete('/subcategory/delete/:id',deleteSubCategory)
module.exports = router