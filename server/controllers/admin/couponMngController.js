const Coupons = require('../../models/coupons');
const jwt = require('jsonwebtoken');

exports.getCoupons = async (req, res) => {
    try {
        const token = req.cookies.admin_token;
        if (!token) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
        if (!decoded.isAdmin) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const coupons = await Coupons.find();
        res.json(coupons);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.addCoupon = async (req, res) => {
    try {
        const token = req.cookies.admin_token;
        if (!token) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
        if (!decoded.isAdmin) {
            return res.status(403).json({ message: 'Not authorized' });
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
        res.json(newCoupon);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateCoupon = async (req, res) => {
    try {
        const token = req.cookies.admin_token;
        if (!token) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
        if (!decoded.isAdmin) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { id } = req.params;
        const { name, code, description, type, discount, minPrice, expiry } = req.body;
        const updatedCoupon = await Coupons.findByIdAndUpdate(id, {
            name,
            code: code.toUpperCase(),
            description,
            type,
            discount,
            minPrice,
            expiry
        }, { new: true });
        res.json(updatedCoupon);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteCoupon = async (req, res) => {
    try {
        const token = req.cookies.admin_token;
        if (!token) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
        if (!decoded.isAdmin) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { id } = req.params;
        await Coupons.findByIdAndDelete(id);
        res.json({ message: 'Coupon deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};