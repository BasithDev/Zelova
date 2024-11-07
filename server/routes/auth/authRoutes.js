const express = require('express');
const router = express.Router();
const passport = require('../../config/passport');
const authController = require('../../controllers/auth/authController');
const { loginLimiter } = require('../../middlewares/rateLimiter');

router.post('/register', authController.registerUser);
router.post('/verify-otp', authController.verifyOTP);
router.post('/resend-otp', authController.resendOTP);
router.post('/login', loginLimiter, authController.login);
router.post('/logout', authController.logout);
router.get('/google', authController.initiateGoogleLogin(passport));
router.get(
    '/google/callback',
    authController.handleGoogleCallback(passport),
    authController.generateTokenAndRedirect
);

module.exports = router;