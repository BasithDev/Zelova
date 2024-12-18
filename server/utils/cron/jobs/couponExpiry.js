const Coupons = require('../../../models/coupons');

const handleExpiredCoupons = async () => {
    try {
        const currentDate = new Date();
        
        const result = await Coupons.deleteMany({
            expiry: { $lt: currentDate },
            expiry: { $ne: null } 
        });

        console.log(`Cleaned up ${result.deletedCount} expired coupons`);

    } catch (error) {
        console.error('Error in coupon expiry job:', error);
    }
};

module.exports = handleExpiredCoupons;