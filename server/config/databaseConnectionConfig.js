const mongoose = require('mongoose');
const initCronJobs = require('../utils/cron');
require('dotenv').config();

const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('Database connected successfully');
        initCronJobs();
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1)
    }
}

module.exports = connectDB;