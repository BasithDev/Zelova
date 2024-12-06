const User = require('../../models/user')

const getUsers = async (req,res)=>{
try {
    const users = await User.find({ isVendor: false });
    res.status(200).json(users);
} catch (error) {
    res.status(500).json({ 
        status:"Failed",
        message: "Error retrieving users", error });
}
}

const blockUnblockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;
    if (!["active", "blocked"].includes(status)) {
      return res.status(400).json({
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
      return res.status(404).json({
        status: "Failed",
        message: "User not found",
      });
    }
    if (status === "blocked") {
      res.clearCookie('user_token');
      res.clearCookie('is_vendor');
    }
    res.status(200).json({
      status: "Success",
      message: `User ${status === "blocked" ? "blocked" : "unblocked"} successfully`,
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
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