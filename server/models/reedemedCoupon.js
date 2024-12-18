const mongoose = require('mongoose');

const redeemedCouponSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    couponId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coupon',
        required: true
    }
}, {
    timestamps: true
});

redeemedCouponSchema.index({ userId: 1, couponId: 1 }, { unique: true });

const RedeemedCoupon = mongoose.model('RedeemedCoupon', redeemedCouponSchema);

module.exports = RedeemedCoupon;