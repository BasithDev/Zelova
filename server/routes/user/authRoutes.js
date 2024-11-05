const express = require('express');
const router = express.Router();
const passport = require('../../config/passport');
const googleAuthController = require('../../controllers/user/googleAuth');
const { loginUser, registerUser, verifyOTP, resendOTP, logoutUser } = require('../../controllers/user/authController');
const { loginLimiter } = require('../../middlewares/rateLimiter');

router.post('/register', registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', loginLimiter, loginUser);
router.post('/logout', logoutUser);

router.get('/google', googleAuthController.initiateGoogleLogin(passport));
router.get(
    '/google/callback',
    googleAuthController.handleGoogleCallback(passport),
    googleAuthController.generateTokenAndRedirect
);

module.exports = router;