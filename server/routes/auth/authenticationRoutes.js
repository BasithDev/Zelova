const express = require('express');
const router = express.Router();
const passport = require('../../config/authenticationConfig');
const authController = require('../../controllers/auth/authenticationController');
const { loginLimiter } = require('../../middlewares/rateLimitingMiddleware');

router.post('/register', authController.registerUser);
router.post('/verify-otp', authController.verifyOTP);
router.post('/resend-otp', authController.resendOTP);
router.post('/otp-reset-password', authController.sendOTPForResetPassword);
router.post('/verify-otp-reset-password', authController.verifyOTPForResetPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/login', loginLimiter, authController.login);
router.post('/logout', authController.logout);
router.get('/google', authController.initiateGoogleLogin(passport));
router.get(
    '/google/callback',
    authController.handleGoogleCallback(passport),
    authController.generateTokenAndRedirect
);

module.exports = router;