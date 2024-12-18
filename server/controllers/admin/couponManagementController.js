const Coupons = require('../../models/coupons');
const jwt = require('jsonwebtoken');
const statusCodes = require('../../config/statusCodes');

const getCoupons = async (req, res, next) => {
    try {
        const token = req.cookies.admin_token;
        if (!token) {
            return res.status(statusCodes.UNAUTHORIZED).json({ message: 'Not authorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
        if (!decoded.isAdmin) {
            return res.status(statusCodes.FORBIDDEN).json({ message: 'Not authorized' });
        }

        const coupons = await Coupons.find();
        res.json(coupons);
    } catch (error) {
        next(error); // Pass the error to the error middleware
    }
};

const addCoupon = async (req, res, next) => {
    try {
        const token = req.cookies.admin_token;
        if (!token) {
            return res.status(statusCodes.UNAUTHORIZED).json({ message: 'Not authorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
        if (!decoded.isAdmin) {
            return res.status(statusCodes.FORBIDDEN).json({ message: 'Not authorized' });
        }

        const { name, code, description, type, discount, minPrice, expiry } = req.body;
        const newCoupon = new Coupons({
            name,
            code: code.toUpperCase(),
            description,
            type,
            discount,
            minPrice,
            expiry
        });

        await newCoupon.save();
        res.status(statusCodes.CREATED).json(newCoupon);
    } catch (error) {
        next(error); // Pass the error to the error middleware
    }
};

const updateCoupon = async (req, res, next) => {
    try {
        const token = req.cookies.admin_token;
        if (!token) {
            return res.status(statusCodes.UNAUTHORIZED).json({ message: 'Not authorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
        if (!decoded.isAdmin) {
            return res.status(statusCodes.FORBIDDEN).json({ message: 'Not authorized' });
        }

        const { id } = req.params;
        const { name, code, description, type, discount, minPrice, expiry } = req.body;
        const updatedCoupon = await Coupons.findByIdAndUpdate(
            id,
            { name, code: code.toUpperCase(), description, type, discount, minPrice, expiry },
            { new: true }
        );

        if (!updatedCoupon) {
            return res.status(statusCodes.NOT_FOUND).json({ message: 'Coupon not found' });
        }

        res.status(statusCodes.OK).json(updatedCoupon);
    } catch (error) {
        next(error); // Pass the error to the error middleware
    }
};

const deleteCoupon = async (req, res, next) => {
    try {
        const token = req.cookies.admin_token;
        if (!token) {
            return res.status(statusCodes.UNAUTHORIZED).json({ message: 'Not authorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
        if (!decoded.isAdmin) {
            return res.status(statusCodes.FORBIDDEN).json({ message: 'Not authorized' });
        }

        const { id } = req.params;
        const deletedCoupon = await Coupons.findByIdAndDelete(id);

        if (!deletedCoupon) {
            return res.status(statusCodes.NOT_FOUND).json({ message: 'Coupon not found' });
        }

        res.status(statusCodes.OK).json({ message: 'Coupon deleted successfully' });
    } catch (error) {
        next(error); // Pass the error to the error middleware
    }
};

module.exports = {
  getCoupons,
  addCoupon,
  updateCoupon,
  deleteCoupon
};