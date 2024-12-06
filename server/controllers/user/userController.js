const User = require('../../models/user');
const Address = require('../../models/Address')
const cloudinary = require('cloudinary').v2;
const Otp = require('../../models/otp')
const { sendOTPEmail } = require('../../config/mailer');
const bcrypt = require('bcryptjs');
const {getUserId} = require('../../helpers/getUserId')
const statusCodes = require('../../config/statusCodes');

const getUserById = async (req, res) => {
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
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            status: "Failed",
            message: "Error retrieving user",
            error
        });
    }
};

const updateProfile = async (req, res) => {
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
    console.error(error);
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while updating the profile" });
  }
};

const deleteImage = async (req, res) => {
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
    console.error(error);
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to delete image" });
  }
};

const sendOTP = async (req,res)=>{
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
    console.log(error)
    return res.status(statusCodes.CREATED).json({
      status: 'Success',
      message: "couldn't sent OTP",
  });
  }
}

const updateEmail = async (req,res)=>{
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
    console.error(error);
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'Failed',
      message: 'Failed to update email'
    });
  }
}

const resetPassword = async (req, res) => {
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
    console.log(error)
    console.error("Error updating password:", error);
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ status: 'Error', message: 'An error occurred while updating the password.' });
  }
};

const getUserStatus = async (req, res) => {
  try {
      const userId = req.params.id;
      const user = await User.findById(userId);

      if (!user) {
          return res.status(statusCodes.NOT_FOUND).json({ message: 'User not found' });
      }

      res.status(statusCodes.OK).json({ status: user.status });
  } catch (error) {
      console.error('Error fetching user status:', error);
      res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
  }
};

const addAddress = async (req,res) => {
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
    console.error('Error adding new Address:', error);
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
  }
}

const getAddresses = async (req,res)=>{
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
    console.error('Error getting addresses:', error);
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
  }
}

const deleteAddress = async (req,res) =>{
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
    console.error("Error deleting address:", error);
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
  }
}

const updateAddress = async (req,res)=>{
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
    console.error("Error updating address:", error);    
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
  }
}

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
  updateAddress
};