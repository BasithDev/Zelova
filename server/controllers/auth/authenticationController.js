const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const Restaurant = require('../../models/restaurant')
const Otp = require('../../models/otp')
const { sendOTPEmail } = require('../../config/emailServiceConfig');
const statusCodes = require('../../config/statusCodes');

const OTP_COOLDOWN_PERIOD_MS = 30000;

const login = async (req, res, next) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(statusCodes.UNAUTHORIZED).json({ message: "User not found" });
        }

        if (user.status === "blocked") {
            return res.status(statusCodes.FORBIDDEN).json({ 
                status: "Failed",
                message: "Your account is blocked. Please contact support." 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(statusCodes.UNAUTHORIZED).json({ message: "Invalid credentials" });
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

        return res.status(statusCodes.OK).json({ 
            status: "Success",
            Id:user._id,
            token: token,
            isVendor:user.isVendor,
            isAdmin:user.isAdmin,
            restaurantId:restaurant ? restaurant._id : null
        });
    } catch (error) {
        next(error);
    }
};
const logout = (req, res, next) => {
    const { role } = req.body;
    
    try {
        if (role === 'admin') {
            return res.status(statusCodes.OK).json({
                status: "Success",
                message: "Admin logout successful"
            });
        } else if (role === 'user') {
            return res.status(statusCodes.OK).json({
                status: "Success",
                message: "User logout successful"
            });
        } else {
            return res.status(statusCodes.BAD_REQUEST).json({
                status: "Failed",
                message: "Logged Out"
            });
        }
    } catch (error) {
        next(error);
    }
};
const registerUser = async (req, res, next) => {
    try {
        const { fullname, email, password, age, phoneNumber } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(statusCodes.BAD_REQUEST).json({
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
        return res.status(statusCodes.CREATED).json({
            status: 'Success',
            message: 'User registered successfully',
        });
    } catch (error) {
        next(error);
    }
};
const verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const otpRecord = await Otp.findOne({ email, otp });
        if (!otpRecord) {
            return res.status(statusCodes.BAD_REQUEST).json({
                status: 'Failed',
                message: 'Invalid or expired OTP',
            });
        }
        await Otp.deleteMany({ email });
        return res.status(statusCodes.OK).json({
            status: 'Success',
            message: 'OTP verified successfully',
        });
    } catch (error) {
        next(error);
    }
};
const resendOTP = async (req, res, next) => {
    try {
        const { email } = req.body;
        let otpRecord = await Otp.findOne({ email });

        if (otpRecord) {
            const now = Date.now();
            const timeSinceLastRequest = now - new Date(otpRecord.lastRequested).getTime();
            if (timeSinceLastRequest < OTP_COOLDOWN_PERIOD_MS) {
                return res.status(statusCodes.TOO_MANY_REQUESTS).json({
                    status: 'Failed',
                    message: `Please wait for some time before requesting another OTP.`,
                });
            }
            otpRecord.lastRequested = now;
            await otpRecord.save();
            await sendOTPEmail(email, otpRecord.otp);
            return res.status(statusCodes.OK).json({
                status: 'Success',
                message: 'OTP resent successfully',
            });
        }

        const newOtpCode = Math.floor(100000 + Math.random() * 900000).toString();
        otpRecord = await Otp.create({ email, otp: newOtpCode, lastRequested: Date.now() });
        await sendOTPEmail(email, newOtpCode);
        return res.status(statusCodes.OK).json({
            status: 'Success',
            message: 'New OTP generated and sent successfully',
        });
    } catch (error) {
        next(error);
    }
};

const sendOTPForResetPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        
        // Check if user exists with this email
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(statusCodes.NOT_FOUND).json({
                status: 'Failed',
                message: 'No account exists with this email',
            });
        }

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        await Otp.create({ email, otp: otpCode, lastRequested: Date.now() });
        await sendOTPEmail(email, otpCode);
        
        return res.status(statusCodes.CREATED).json({
            status: 'Success',
            message: 'OTP sent successfully',
        });
    } catch (error) {
        next(error);
    }
};

const verifyOTPForResetPassword = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const otpRecord = await Otp.findOne({ email, otp });
        if (!otpRecord) {
            return res.status(statusCodes.BAD_REQUEST).json({
                status: 'Failed',
                message: 'Invalid or expired OTP',
            });
        }
        await Otp.deleteMany({ email });
        return res.status(statusCodes.OK).json({
            status: 'Success',
            message: 'OTP verified successfully',
        });
    } catch (error) {
        next(error);
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findOneAndUpdate({ email }, { password: hashedPassword });
        return res.status(statusCodes.OK).json({
            status: 'Success',
            message: 'Password reset successfully',
        });
    } catch (error) {
        next(error);
    }
};

const initiateGoogleLogin = (passport) => passport.authenticate('google', { scope: ['profile', 'email'] });
const handleGoogleCallback = (passport) => (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user,info) => {
        if (err || !user) {
            console.log("Error or no user:", { err, info });
            return res.redirect(`${process.env.APP_URL}/login`);
        }
        req.user = user;
        next();
    })(req, res, next);
};
const generateTokenAndRedirect = (req, res, next) => {
    try {
        const { status } = req.user
        if (status === 'blocked') {
            const redirectUrl = `${process.env.APP_URL}/google-response?status=blocked`;
            return res.redirect(redirectUrl);
        }
        const token = jwt.sign(
            { userId: req.user._id, isVendor: req.user.isVendor,restaurantId: req.user.restaurantId, status: req.user.status },
            process.env.JWT_SECRET,
            { expiresIn: '3h' }
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
        next(error);
    }
};

module.exports = {
    login,
    logout,
    registerUser,
    verifyOTP,
    resendOTP,
    initiateGoogleLogin,
    handleGoogleCallback,
    generateTokenAndRedirect,
    sendOTPForResetPassword,
    verifyOTPForResetPassword,
    resetPassword
};