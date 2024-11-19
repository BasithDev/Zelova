const cloudinary = require('cloudinary').v2;
const vendorRequest = require('../../models/vendorRequest');
const User = require('../../models/user')
const Restaurant = require('../../models/restaurant')
const {sendEmail} = require('../../utils/emailService')

exports.getVendorApplications = async (req, res) => {
    try {
        const applications = await vendorRequest.find()
            .populate('userId')
            .lean();
        const formattedApplications = applications.map(app => ({
            ...app,
            user: app.userId,
        }));

        res.status(200).json(formattedApplications);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching vendor applications' });
    }
};
exports.acceptReq = async (req,res)=>{
    try {
        const { id } = req.params;
        const requestId = id
        const request = await vendorRequest.findById(requestId).populate('userId');
        if (!request) {
            return res.status(404).json({ message: 'Vendor request not found' });
        }
        const user = await User.findByIdAndUpdate(
            request.userId._id,
            { isVendor: true },
            { new: true }
        );
        const newRestaurant = new Restaurant({
            vendorId: user._id,
            name: request.restaurantName,
            description: request.description,
        })
        await newRestaurant.save();
        const subject = 'Vendor Request Approved';
        const message = `Hello ${user.fullname},\n\nCongratulations! Your vendor request has been approved. You can now log in as a vendor or continue as a regular user. Please re-login to begin using your vendor account.\n\nBest regards,\nZelova Team`;
        await sendEmail(user.email, subject, message);
        await vendorRequest.findByIdAndDelete(requestId);
        res.status(200).json({ message: 'Vendor request accepted and user notified' });
    } catch (error) {
        console.error('Error accepting vendor request:', error);
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }
}
exports.denyReq = async (req, res) => {
    try {
        const { id } = req.params;
        const applicationId = id
        const application = await vendorRequest.findById(applicationId).populate('userId', 'email fullname');
        if (!application) {
            return res.status(404).json({ error: 'Vendor application not found' });
        }
        const userEmail = application.userId.email;
        const userName = application.userId.fullname;
        await sendEmail(
            userEmail,
            'Vendor Request Denied',
            `Hello ${userName},\n\nWe regret to inform you that your vendor request has been denied. If you have any questions, please contact support.\n\nThank you for your interest.\nBest Regards,\nThe Zelova Team`
        );
        await vendorRequest.findByIdAndDelete(applicationId);
        res.status(200).json({ message: 'Vendor request denied and email sent to the user' });
    } catch (error) {
        console.error('Error denying vendor request:', error);
        res.status(500).json({ error: 'Error processing the request' });
    }
};
exports.deleteImage = async (req, res) => {
    try {
      const { public_id } = req.body;
      if (!public_id) {
        return res.status(400).json({ message: "Public ID is required" });
      }
      await cloudinary.uploader.destroy(public_id);
      res.status(200).json({ message: "Image deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to delete image" });
    }
  };