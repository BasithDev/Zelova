const User = require('../../models/user')
const Restaurant = require('../../models/restaurant')

const getVendors = async (req, res) => {
  try {
    const vendors = await User.find({ isVendor: true });
    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).json({ 
      status: "Failed",
      message: "Error retrieving vendors", error });
  }
}

const blockUnblockVendor = async (req, res) => {
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
      await Restaurant.updateMany(
        { vendorId: userId },
        { isActive: false }
      );
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
  getVendors,
  blockUnblockVendor
};