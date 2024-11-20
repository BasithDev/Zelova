const User = require('../../models/user');
const getUserId = require('../../helpers/getUserId')
exports.getAdminById = async (req, res) => {
    const token = req.cookies.user_token
    const id  = getUserId(token,process.env.JWT_ADMIN_SECRET)
    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                status: "Failed",
                message: "User not found"
            });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: "Error retrieving user",
            error
        });
    }
};