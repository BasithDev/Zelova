const User = require('../../models/user')
const statusCodes = require('../../config/statusCodes')

const getUsers = async (req,res)=>{
try {
    const users = await User.find({ isVendor: false });
    res.status(statusCodes.OK).json(users);
} catch (error) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ 
        status:"Failed",
        message: "Error retrieving users", error });
}
}

const blockUnblockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;
    if (!["active", "blocked"].includes(status)) {
      return res.status(statusCodes.BAD_REQUEST).json({
        status: "Failed",
        message: "Invalid status value. Use 'active' or 'blocked'.",
      });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(statusCodes.NOT_FOUND).json({
        status: "Failed",
        message: "User not found",
      });
    }
    if (status === "blocked") {
      res.clearCookie('user_token');
      res.clearCookie('is_vendor');
    }
    res.status(statusCodes.OK).json({
      status: "Success",
      message: `User ${status === "blocked" ? "blocked" : "unblocked"} successfully`,
      user: updatedUser,
    });
  } catch (error) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      status: "Failed",
      message: "Error blocking/unblocking user",
      error,
    });
  }
};

module.exports = {
  getUsers,
  blockUnblockUser
};