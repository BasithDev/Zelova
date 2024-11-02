const express = require('express');
const router = express.Router();
const {registerUser,verifyOTP,resendOTP} = require('../../controllers/user/authController')

router.post('/register',registerUser)
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);

module.exports = router;