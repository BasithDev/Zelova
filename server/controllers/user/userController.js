const User = require('../../models/user');
const Address = require('../../models/Address')
const cloudinary = require('cloudinary').v2;
const Otp = require('../../models/otp')
const { sendOTPEmail } = require('../../config/mailer');
const bcrypt = require('bcryptjs');
const {getUserId} = require('../../helpers/getUserId')

exports.getUserById = async (req, res) => {
  const token = req.cookies.user_token
    const id  = getUserId(token,process.env.JWT_SECRET)
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

exports.updateProfile = async (req, res) => {
  try {
    const { userId, fullname, age, phoneNumber, profilePicture } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
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
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while updating the profile" });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { public_id, userId } = req.body;
    if (!public_id || !userId) {
      return res.status(400).json({ message: "Public ID is required" });
    }
    await cloudinary.uploader.destroy(public_id);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.profilePicture = '';
    await user.save();
    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete image" });
  }
};
exports.sendOTP = async (req,res)=>{
  try {
    const {email} = req.body
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  await Otp.create({ email, otp: otpCode , lastRequested: Date.now() });
  await sendOTPEmail(email, otpCode);
  return res.status(201).json({
    status: 'Success',
    message: 'OTP sent successfully',
});
  } catch (error) {
    console.log(error)
    return res.status(201).json({
      status: 'Success',
      message: "couldn't sent OTP",
  });
  }
}
exports.updateEmail = async (req,res)=>{
  try {
    const { userId, email, otp } = req.body;
    const otpEntry = await Otp.findOne({ email: email, otp });
    if (!otpEntry || Date.now() - otpEntry.lastRequested > 60000) {
      return res.status(400).json({
        status: 'Failed',
        message: 'Invalid or expired OTP'
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.email = email;
    await user.save();
    await Otp.deleteOne({ email: email });
    res.status(200).json({
      status: 'Success',
      message: 'Email updated successfully',
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'Failed',
      message: 'Failed to update email'
    });
  }
}
exports.resetPassword = async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ status: 'Error', message: 'User not found.' });
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    const isNewSame = await bcrypt.compare(newPassword,user.password)
    if (!isMatch) return res.status(400).json({ status: 'Error', message: 'Old password is incorrect.' });
    if (isNewSame) return res.status(400).json({ status: 'Error', message: 'New password is same as old password' })
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ status: 'Success', message: 'Password updated successfully.' });
  } catch (error) {
    console.log(error)
    console.error("Error updating password:", error);
    res.status(500).json({ status: 'Error', message: 'An error occurred while updating the password.' });
  }
};
exports.getUserStatus = async (req, res) => {
  try {
      const userId = req.params.id;
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ status: user.status });
  } catch (error) {
      console.error('Error fetching user status:', error);
      res.status(500).json({ message: 'Server error' });
  }
};
exports.addAddress = async (req,res) => {
  try {
    const token = req.cookies.user_token
    if (!token) {
      return res.status(401).json({ message: "Unauthorized. No token provided." });
    }
    const userId = getUserId(token, process.env.JWT_SECRET);
    const { label, address, phone } = req.body;

    if (!label || !address || !phone) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newAddress = new Address({
      userId,
      label,
      address,
      phone,
    })

    await newAddress.save();

    res.status(201).json({ message: "Address added successfully", address: newAddress });

  } catch (error) {
    console.error('Error adding new Address:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
exports.getAddresses = async (req,res)=>{
  try {
    const token = req.cookies.user_token
    if (!token) {
      return res.status(401).json({ message: "Unauthorized. No token provided." });
    }
    const userId  = getUserId(token,process.env.JWT_SECRET)
    const addresses = await Address.find({ userId });

    if (!addresses || addresses.length === 0) {
      return res.status(200).json({ message: "No addresses found." });
    }

    res.status(200).json({ message: "Addresses retrieved successfully", addresses });

  } catch (error) {
    console.error('Error getting addresses:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.deleteAddress = async (req,res) =>{
  try {
    const { addressId } = req.params;
    const token = req.cookies.user_token
    if (!token) {
      return res.status(401).json({ message: "Unauthorized. No token provided." });
    }
    const userId  = getUserId(token,process.env.JWT_SECRET)

    const address = await Address.findOneAndDelete({ _id: addressId, userId });

    if (!address) {
      return res.status(404).json({ message: "Address not found or not authorized" });
    }

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ message: "Server error" });
  }
}
exports.updateAddress = async (req,res)=>{
  try {
    const { addressId } = req.params;
    const token = req.cookies.user_token
    if (!token) {
      return res.status(401).json({ message: "Unauthorized. No token provided." });
    }
    const userId  = getUserId(token,process.env.JWT_SECRET)
    const { label, address, phone } = req.body;

    if (!label || !address || !phone) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const updatedAddress = await Address.findOneAndUpdate(
      { _id: addressId, userId },
      { label, address, phone },
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({ message: "Address not found or not authorized" });
    }

    res.status(200).json({ message: "Address updated successfully", address: updatedAddress });
  } catch (error) {
    console.error("Error updating address:", error);    
    res.status(500).json({ message: "Server error" });
  }
}