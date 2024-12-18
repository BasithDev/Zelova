const cloudinary = require('cloudinary').v2;
const vendorRequest = require('../../models/vendorRequest');
const User = require('../../models/user')
const Restaurant = require('../../models/restaurant')
const {sendEmail} = require('../../utils/emailService')
const statusCodes = require('../../config/statusCodes');

const getVendorApplications = async (req, res, next) => {
    try {
        const applications = await vendorRequest.find()
            .populate('userId')
            .lean();
        const formattedApplications = applications.map(app => ({
            ...app,
            user: app.userId,
        }));

        res.status(statusCodes.OK).json(formattedApplications);
    } catch (error) {
        next(error);
    }
};

const getVendorPendingRequestsCount = async (req, res, next) => {
    try {
        const count = await vendorRequest.countDocuments({ status: 'pending' });
        res.status(statusCodes.OK).json({ count });
    } catch (error) {
        next(error);
    }
};

const acceptReq = async (req, res, next) => {
    try {
        const { id } = req.params;
        const requestId = id
        const request = await vendorRequest.findById(requestId).populate('userId');
        if (!request) {
            return res.status(statusCodes.NOT_FOUND).json({ message: 'Vendor request not found' });
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
            image:"https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-picture-coming-creative-vector-png-image_40968940.jpg",
            location: {
                type: "Point",
                coordinates: [0, 0]
            }
        })
        await newRestaurant.save();
        const subject = 'Vendor Request Approved';
        const message = `Hello ${user.fullname},\n\nCongratulations! Your vendor request has been approved. You can now log in as a vendor or continue as a regular user. Please re-login to begin using your vendor account.\n\nBest regards,\nZelova Team`;
        await sendEmail(user.email, subject, message);
        await vendorRequest.findByIdAndDelete(requestId);
        res.status(statusCodes.OK).json({ message: 'Vendor request accepted and user notified' });
    } catch (error) {
        console.error('Error accepting vendor request:', error);
        next(error);
    }
};

const denyReq = async (req, res, next) => {
    try {
        const { id } = req.params;
        const applicationId = id
        const application = await vendorRequest.findById(applicationId).populate('userId', 'email fullname');
        if (!application) {
            return res.status(statusCodes.NOT_FOUND).json({ error: 'Vendor application not found' });
        }
        const userEmail = application.userId.email;
        const userName = application.userId.fullname;
        await sendEmail(
            userEmail,
            'Vendor Request Denied',
            `Hello ${userName},\n\nWe regret to inform you that your vendor request has been denied. If you have any questions, please contact support.\n\nThank you for your interest.\nBest Regards,\nThe Zelova Team`
        );
        await vendorRequest.findByIdAndDelete(applicationId);
        res.status(statusCodes.OK).json({ message: 'Vendor request denied and email sent to the user' });
    } catch (error) {
        console.error('Error denying vendor request:', error);
        next(error);
    }
};

const deleteImage = async (req, res, next) => {
    try {
      const { public_id } = req.body;
      if (!public_id) {
        return res.status(statusCodes.BAD_REQUEST).json({ message: "Public ID is required" });
      }
      await cloudinary.uploader.destroy(public_id);
      res.status(statusCodes.OK).json({ message: "Image deleted successfully" });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

module.exports = {
  getVendorApplications,
  acceptReq,
  denyReq,
  deleteImage,
  getVendorPendingRequestsCount
};