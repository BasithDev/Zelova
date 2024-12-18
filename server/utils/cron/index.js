const cron = require('node-cron');
const cronConfig = require('../../config/taskSchedulerConfig');
const handleExpiredCoupons = require('./jobs/couponExpiry');

const initCronJobs = () => {
    cron.schedule(cronConfig.couponExpiry, () => {
        console.log('Running coupon expiry check...');
        handleExpiredCoupons();
    });
    
    console.log('Cron jobs initialized');
};

module.exports = initCronJobs;