const User = require('../../models/user')
const bcrypt = require('bcryptjs');

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
        return res.status(201).json({
            status: 'Success',
            message: 'User registered successfully',
            user: { fullname, email },
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'Failed',
            message: 'Server error'
        });
    }
};