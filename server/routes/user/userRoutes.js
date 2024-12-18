const express = require('express');
const router = express.Router();
const {getUserById,updateProfile, deleteImage, sendOTP, updateEmail, resetPassword, getUserStatus, addAddress, getAddresses, deleteAddress, updateAddress, raiseIssue} = require('../../controllers/user/userOperationsController')
router.get('/',getUserById)
router.put('/update-profile',updateProfile)
router.post('/delete-image',deleteImage)
router.post('/send-otp',sendOTP)
router.patch('/update-email',updateEmail)
router.patch('/reset-password',resetPassword)
router.get('/status/:id',getUserStatus)
router.post('/address/new',addAddress)
router.get('/addresses',getAddresses)
router.delete('/address/:addressId/delete',deleteAddress)
router.put('/address/:addressId/update',updateAddress)
router.post('/raise-issue',raiseIssue)
module.exports = router