const Coupon = require('../../models/coupons');
const RedeemedCoupon = require('../../models/reedemedCoupon');
const { getUserId } = require('../../helpers/getUserId');
const statusCodes = require('../../config/statusCodes');

const getAvailableCoupons = async (req, res) => {
    try {
        const token = req.cookies.user_token;
        if (!token) {
            return res.status(statusCodes.UNAUTHORIZED).json({ message: 'Not authorized' });
        }
        const userId = getUserId(token, process.env.JWT_SECRET);
        const redeemedCoupons = await RedeemedCoupon.find({ userId });
        const allCoupons = await Coupon.find();
        const availableCoupons = allCoupons.filter(coupon => !redeemedCoupons.some(rc => rc.couponId.equals(coupon._id)));
        res.status(statusCodes.OK).json(availableCoupons);
    } catch (error) {
        console.error('Error fetching available coupons:', error);
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
    }
};

module.exports = {
  getAvailableCoupons
};