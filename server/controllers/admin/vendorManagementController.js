const User = require('../../models/user')
const Restaurant = require('../../models/restaurant')
const statusCodes = require('../../config/statusCodes')

const getVendors = async (req, res, next) => {
  try {
    const vendors = await User.find({ isVendor: true });
    res.status(statusCodes.OK).json(vendors);
  } catch (error) {
    next(error);
  }
}

const blockUnblockVendor = async (req, res, next) => {
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
      await Restaurant.updateMany(
        { vendorId: userId },
        { isActive: false }
      );
      res.clearCookie('user_token');
      res.clearCookie('is_vendor');
    }
    res.status(statusCodes.OK).json({
      status: "Success",
      message: `User ${status === "blocked" ? "blocked" : "unblocked"} successfully`,
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVendors,
  blockUnblockVendor
};