const User = require('../../models/user')
const bcrypt = require('bcryptjs');
const Otp = require('../../models/otp')
const { sendOTPEmail } = require('../../config/mailer');
const OTP_COOLDOWN_PERIOD_MS = 30000;
const jwt = require('jsonwebtoken');

//code for registering user and checking if the user already existing with same mailID
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
//to verify the user entered OTP and if success remvoe the otp from the db
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
/*
resend the OTP if the send the same OTP if it hasn't expried 
else generate new one 
and Request cooldown also handleded
*/
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

exports.loginUser =async (req,res)=>{
    const {email,password} = req.body
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "No User Found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const payload = {
            userId: user._id,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('user_token', token, {
            maxAge: 3600000,
        });
        return res.status(200).json({ 
            status:"Success",
            token:token,
            isVendor: user.isVendor,
            status: user.status,
            message: "Login successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            status:"Failed",
            message: "Server error" });
    }
}