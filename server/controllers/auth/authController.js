const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const Restaurant = require('../../models/restaurant')
const Otp = require('../../models/otp')
const { sendOTPEmail } = require('../../config/mailer');

const OTP_COOLDOWN_PERIOD_MS = 30000;

exports.login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        if (user.status === "blocked") {
            return res.status(403).json({ 
                status: "Failed",
                message: "Your account is blocked. Please contact support." 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const restaurant = await Restaurant.findOne({ vendorId: user._id });

        const payload = {
            userId: user._id,
            isVendor: user.isVendor,
            isAdmin: user.isAdmin,
            restaurantId: restaurant ? restaurant._id : null
        };

        const secret = user.isAdmin ? process.env.JWT_ADMIN_SECRET : process.env.JWT_SECRET;
        const tokenName = user.isAdmin ? 'admin_token' : 'user_token';
        const token = jwt.sign(payload, secret, { expiresIn: '3h' });

        res.cookie(tokenName, token, { maxAge: 10800000 });

        return res.status(200).json({ 
            status: "Success",
            Id:user._id,
            token: token,
            isVendor:user.isVendor,
            isAdmin:user.isAdmin,
            status:user.status,
            message: "Login successful"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            status: "Failed",
            message: "Server error"
        });
    }
};
exports.logout = (req, res) => {
    const { role } = req.body;
    
    try {
        if (role === 'admin') {
            return res.status(200).json({
                status: "Success",
                message: "Admin logout successful"
            });
        } else if (role === 'user') {
            return res.status(200).json({
                status: "Success",
                message: "User logout successful"
            });
        } else {
            return res.status(400).json({
                status: "Failed",
                message: "Logged Out"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "Failed",
            message: "Server error"
        });
    }
};
exports.registerUser = async (req, res) => {
    try {
        const { fullname, email, password, age, phoneNumber } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                status: 'Failed',
                message: 'User already exists'
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            fullname,
            email,
            password: hashedPassword,
            age,
            phoneNumber
        });
        await user.save();
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        await Otp.create({ email, otp: otpCode , lastRequested: Date.now() });
        await sendOTPEmail(email, otpCode);
        return res.status(201).json({
            status: 'Success',
            message: 'User registered successfully',
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'Failed',
            message: 'Server error'
        });
    }
};
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const otpRecord = await Otp.findOne({ email, otp });
        if (!otpRecord) {
            return res.status(400).json({
                status: 'Failed',
                message: 'Invalid or expired OTP',
            });
        }
        await Otp.deleteMany({ email });
        return res.status(200).json({
            status: 'Success',
            message: 'OTP verified successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'Failed',
            message: 'Server error',
        });
    }
};
exports.resendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        let otpRecord = await Otp.findOne({ email });

        if (otpRecord) {
            const now = Date.now();
            const timeSinceLastRequest = now - new Date(otpRecord.lastRequested).getTime();
            if (timeSinceLastRequest < OTP_COOLDOWN_PERIOD_MS) {
                return res.status(429).json({
                    status: 'Failed',
                    message: `Please wait for some time before requesting another OTP.`,
                });
            }
            otpRecord.lastRequested = now;
            await otpRecord.save();
            await sendOTPEmail(email, otpRecord.otp);
            return res.status(200).json({
                status: 'Success',
                message: 'OTP resent successfully',
            });
        }

        const newOtpCode = Math.floor(100000 + Math.random() * 900000).toString();
        otpRecord = await Otp.create({ email, otp: newOtpCode, lastRequested: Date.now() });
        await sendOTPEmail(email, newOtpCode);
        return res.status(200).json({
            status: 'Success',
            message: 'New OTP generated and sent successfully',
        });
    } catch (error) {
        console.error('Error resending OTP:', error);
        res.status(500).json({
            status: 'Failed',
            message: 'Server error',
        });
    }
};
exports.initiateGoogleLogin = (passport) => passport.authenticate('google', { scope: ['profile', 'email'] });
exports.handleGoogleCallback = (passport) => (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user) => {
        if (err || !user) {
            return res.status(401).json({ 
              status:"Failed",
              message: 'Authentication failed' });
        }
        req.user = user;
        next();
    })(req, res, next);
};
exports.generateTokenAndRedirect = (req, res) => {
    try {
        const token = jwt.sign(
            { userId: req.user._id, isVendor: req.user.isVendor, status: req.user.status },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.cookie('user_token', token, {maxAge: 3600000});
        res.set({
            'Cache-Control': 'no-store',
            'Pragma': 'no-cache',
        });
        const redirectUrl = req.user.isVendor
            ? `${process.env.APP_URL}/role-select`
            : process.env.APP_URL;
        res.redirect(redirectUrl);
    } catch (error) {
        console.error('Token generation error:', error);
        res.status(500).json({ message: 'Server error during token generation' });
    }
};