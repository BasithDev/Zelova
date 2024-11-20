const express = require('express');
const router = express.Router();
const {getUserById,updateProfile, deleteImage, sendOTP, updateEmail, resetPassword, getUserStatus} = require('../../controllers/user/userController')
router.get('/',getUserById)
router.put('/update-profile',updateProfile)
router.post('/delete-image',deleteImage)
router.post('/send-otp',sendOTP)
router.patch('/update-email',updateEmail)
router.patch('/reset-password',resetPassword)
router.get('/status/:id',getUserStatus)
module.exports = router