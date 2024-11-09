const User = require('../../models/user');

exports.getUserById = async (req, res) => {
    const { id } = req.params;
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