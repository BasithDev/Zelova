const User = require('../../models/user');
const getUserId = require('../../helpers/getUserId')
const statusCodes = require('../../config/statusCodes');
const getAdminById = async (req, res, next) => {
    const token = req.cookies.admin_token;
    const id = getUserId(token, process.env.JWT_ADMIN_SECRET);
    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(statusCodes.NOT_FOUND).json({
                status: "Failed",
                message: "User not found"
            });
        }

        res.status(statusCodes.OK).json(user);
    } catch (error) {
        error.statusCode = statusCodes.INTERNAL_SERVER_ERROR;
        error.message = "Error retrieving user";
        next(error);
    }
};
module.exports = { getAdminById };