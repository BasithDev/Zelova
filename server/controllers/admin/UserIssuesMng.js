const Issues = require('../../models/issues');
const Zcoin = require('../../models/zcoin');
const User = require('../../models/user');
const Order = require('../../models/orders');
const statusCodes = require('../../config/statusCodes');
const {sendEmail} = require('../../utils/emailService');

const getIssues = async (req, res) => {
    try {
        const issues = await Issues.find();
        return res.status(statusCodes.OK).json({
            success: true,
            issues,
        });
    } catch (error) {
        console.error(error);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Something went wrong',
        });
    }
};

const resolveIssue = async (req, res) => {
    try {
        const { issueId } = req.query;
        const issue = await Issues.findByIdAndDelete(issueId);
        if (!issue) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: 'Issue not found',
            });
        }
        const to = issue.userEmail;
        const subject = `Issue Resolved , RaisedOn ${issue.createdAt.toLocaleDateString()}`;
        const text = `Your issue on ${issue.problemOn} has been resolved. We apologize for any inconvenience caused.`;
        await sendEmail(to, subject, text);
        return res.status(statusCodes.OK).json({
            success: true,
            message: 'Issue resolved successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Something went wrong',
        });
    }
};

const IgnoreIssue = async (req, res) => {
    try {
        const { issueId } = req.query;
        const issue = await Issues.findByIdAndDelete(issueId);
        if (!issue) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: 'Issue not found',
            });
        }
        const to = issue.userEmail;
        const subject = `Issue Ignored , RaisedOn ${issue.createdAt.toLocaleDateString()}`;
        const text = `Your issue on ${issue.problemOn} has been ignored. We apologize for any inconvenience caused.`;
        await sendEmail(to, subject, text);
        return res.status(statusCodes.OK).json({
            success: true,
            message: 'Issue ignored successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Something went wrong',
        });
    }
};

const refundUser = async (req, res) => {
    try {
        const {userId,refundAmt,issueId} = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: 'User not found',
            });
        }

        const userZcoin = await Zcoin.findOneAndUpdate(
            { userId: userId },
            { $inc: { balance: refundAmt } },
            { new: true }
        );
        
        if (!userZcoin) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: 'User zcoins not found',
            });
        }

        const issue = await Issues.findByIdAndDelete(issueId);
        if (!issue) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: 'Issue not found',
            });
        }

        const to = user.email;
        const subject = `Issue Resolved , RaisedOn ${issue.createdAt.toLocaleDateString()}`;
        const text = `Your issue on ${issue.problemOn} has been resolved And Refund of ${refundAmt} Zcoins has been processed. We apologize for any inconvenience caused.`;
        await sendEmail(to, subject, text);

        return res.status(statusCodes.OK).json({
            success: true,
            message: 'User refunded successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Something went wrong',
        });
    }
};

const getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;
        
        const order = await Order.findOne({ orderId })
            .populate('restaurantId', 'name address');

        if (!order) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: 'Order not found'
            });
        }

        const orderDetails = {
            orderId: order.orderId,
            restaurantName: order.restaurantId.name,
            restaurantAddress: order.restaurantId.address,
            orderDate: new Date(order.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            status: order.status,
            items: order.items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount: order.billDetails.finalAmount,
            deliveryAddress: order.user.address
        };

        return res.status(statusCodes.OK).json({
            success: true,
            orderDetails
        });
    } catch (error) {
        console.error('Error fetching order details:', error);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch order details'
        });
    }
};

module.exports = {
    getIssues,
    resolveIssue,
    IgnoreIssue,
    refundUser,
    getOrderDetails
};