const User = require('../../models/user');
const Address = require('../../models/Address')
const Issues = require('../../models/issues');
const cloudinary = require('cloudinary').v2;
const Otp = require('../../models/otp')
const { sendOTPEmail } = require('../../config/emailServiceConfig');
const bcrypt = require('bcryptjs');
const getUserId = require('../../helpers/userIdHelper')
const statusCodes = require('../../config/statusCodes');

const getUserById = async (req, res, next) => {
  const token = req.cookies.user_token
    const id  = getUserId(token,process.env.JWT_SECRET)
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
        next(error);
    }
};

const updateProfile = async (req, res, next) => {
  try {
    const { userId, fullname, age, phoneNumber, profilePicture } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(statusCodes.NOT_FOUND).json({ message: "User not found" });
    }
    const updateData = {
      fullname,
      age,
      phoneNumber,
      profilePicture,
    };
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );
    if (!updatedUser) return res.status(statusCodes.NOT_FOUND).json({ message: "User not found" });
    res.status(statusCodes.OK).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

const deleteImage = async (req, res, next) => {
  try {
    const { public_id, userId } = req.body;
    if (!public_id || !userId) {
      return res.status(statusCodes.BAD_REQUEST).json({ message: "Public ID is required" });
    }
    await cloudinary.uploader.destroy(public_id);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(statusCodes.NOT_FOUND).json({ message: "User not found" });
    }
    user.profilePicture = '';
    await user.save();
    res.status(statusCodes.OK).json({ message: "Image deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const sendOTP = async (req,res,next)=>{
  try {
    const {email} = req.body
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  await Otp.create({ email, otp: otpCode , lastRequested: Date.now() });
  await sendOTPEmail(email, otpCode);
  return res.status(statusCodes.CREATED).json({
    status: 'Success',
    message: 'OTP sent successfully',
});
  } catch (error) {
    next(error);
  }
}

const updateEmail = async (req,res,next)=>{
  try {
    const { userId, email, otp } = req.body;
    const otpEntry = await Otp.findOne({ email: email, otp });
    if (!otpEntry || Date.now() - otpEntry.lastRequested > 60000) {
      return res.status(statusCodes.BAD_REQUEST).json({
        status: 'Failed',
        message: 'Invalid or expired OTP'
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(statusCodes.NOT_FOUND).json({ message: 'User not found' });
    }
    user.email = email;
    await user.save();
    await Otp.deleteOne({ email: email });
    res.status(statusCodes.OK).json({
      status: 'Success',
      message: 'Email updated successfully',
      user
    });
  } catch (error) {
    next(error);
  }
}

const resetPassword = async (req, res, next) => {
  const { userId, oldPassword, newPassword } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(statusCodes.NOT_FOUND).json({ status: 'Error', message: 'User not found.' });
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    const isNewSame = await bcrypt.compare(newPassword,user.password)
    if (!isMatch) return res.status(statusCodes.BAD_REQUEST).json({ status: 'Error', message: 'Old password is incorrect.' });
    if (isNewSame) return res.status(statusCodes.BAD_REQUEST).json({ status: 'Error', message: 'New password is same as old password' })
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(statusCodes.OK).json({ status: 'Success', message: 'Password updated successfully.' });
  } catch (error) {
    next(error);
  }
};

const getUserStatus = async (req, res, next) => {
  try {
      const userId = req.params.id;
      const user = await User.findById(userId);

      if (!user) {
          return res.status(statusCodes.NOT_FOUND).json({ message: 'User not found' });
      }

      res.status(statusCodes.OK).json({ status: user.status });
  } catch (error) {
      next(error);
  }
};

const addAddress = async (req,res,next) => {
  try {
    const token = req.cookies.user_token
    if (!token) {
      return res.status(statusCodes.UNAUTHORIZED).json({ message: "Unauthorized. No token provided." });
    }
    const userId = getUserId(token, process.env.JWT_SECRET);
    const { label, address, phone } = req.body;

    if (!label || !address || !phone) {
      return res.status(statusCodes.BAD_REQUEST).json({ message: "All fields are required." });
    }

    const newAddress = new Address({
      userId,
      label,
      address,
      phone,
    })

    await newAddress.save();

    res.status(statusCodes.CREATED).json({ message: "Address added successfully", address: newAddress });

  } catch (error) {
    next(error);
  }
}

const getAddresses = async (req,res,next)=>{
  try {
    const token = req.cookies.user_token
    if (!token) {
      return res.status(statusCodes.UNAUTHORIZED).json({ message: "Unauthorized. No token provided." });
    }
    const userId  = getUserId(token,process.env.JWT_SECRET)
    const addresses = await Address.find({ userId });

    if (!addresses || addresses.length === 0) {
      return res.status(statusCodes.OK).json({ message: "No addresses found." });
    }

    res.status(statusCodes.OK).json({ message: "Addresses retrieved successfully", addresses });

  } catch (error) {
    next(error);
  }
}

const deleteAddress = async (req,res,next) =>{
  try {
    const { addressId } = req.params;
    const token = req.cookies.user_token
    if (!token) {
      return res.status(statusCodes.UNAUTHORIZED).json({ message: "Unauthorized. No token provided." });
    }
    const userId  = getUserId(token,process.env.JWT_SECRET)

    const address = await Address.findOneAndDelete({ _id: addressId, userId });

    if (!address) {
      return res.status(statusCodes.NOT_FOUND).json({ message: "Address not found or not authorized" });
    }

    res.status(statusCodes.OK).json({ message: "Address deleted successfully" });
  } catch (error) {
    next(error);
  }
}

const updateAddress = async (req,res,next)=>{
  try {
    const { addressId } = req.params;
    const token = req.cookies.user_token
    if (!token) {
      return res.status(statusCodes.UNAUTHORIZED).json({ message: "Unauthorized. No token provided." });
    }
    const userId  = getUserId(token,process.env.JWT_SECRET)
    const { label, address, phone } = req.body;

    if (!label || !address || !phone) {
      return res.status(statusCodes.BAD_REQUEST).json({ message: "All fields are required." });
    }

    const updatedAddress = await Address.findOneAndUpdate(
      { _id: addressId, userId },
      { label, address, phone },
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(statusCodes.NOT_FOUND).json({ message: "Address not found or not authorized" });
    }

    res.status(statusCodes.OK).json({ message: "Address updated successfully", address: updatedAddress });
  } catch (error) {
    next(error);
  }
}

const raiseIssue = async (req, res) => {
  try {
      const { userId, username, userEmail, problemOn, description ,refund ,orderId} = req.body;
      const issue = new Issues({
          userId,
          username,
          userEmail,
          problemOn,
          description,
          refund,
          orderId
      });
      await issue.save();
      return res.status(statusCodes.OK).json({
          success: true,
          message: 'Issue raised successfully',
      });
  } catch (error) {
      console.error(error);
      return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: 'Something went wrong',
      });
  }
};

module.exports = {
  getUserById,
  updateProfile,
  deleteImage,
  sendOTP,
  updateEmail,
  resetPassword,
  getUserStatus,
  addAddress,
  getAddresses,
  deleteAddress,
  updateAddress,
  raiseIssue
};