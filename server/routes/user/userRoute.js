const express = require('express');
const router = express.Router();
const {getUserById,updateProfile, deleteImage, sendOTP, updateEmail, resetPassword} = require('../../controllers/user/userController')
router.get('/:id',getUserById)
router.put('/update-profile',updateProfile)
router.post('/delete-image',deleteImage)
router.post('/send-otp',sendOTP)
router.patch('/update-email',updateEmail)
router.patch('/reset-password',resetPassword)
module.exports = router