const express = require('express');
const router = express.Router();
const {loginUser,registerUser,verifyOTP,resendOTP} = require('../../controllers/user/authController')
const { loginLimiter } = require('../../middlewares/rateLimiter');
router.post('/register',registerUser)
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', loginLimiter, loginUser);

module.exports = router;