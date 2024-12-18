const {sendEmail} = require('../../utils/emailService')
const statusCodes = require('../../config/statusCodes')
const Queue = require('bull');
const User = require('../../models/user');

// Create email queue
const emailQueue = new Queue('email-queue', {
    redis: {
        host: 'localhost',
        port: 6379
    },
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000
        }
    }
});

// Monitor queue events
emailQueue.on('completed', job => {
    console.log(`Job ${job.id} completed. Emails sent: ${job.data.emails.length}`);
});

emailQueue.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed:`, err);
});

emailQueue.on('error', err => {
    console.error('Queue error:', err);
});

// Process emails
emailQueue.process(async (job) => {
    const { emails, subject, message } = job.data;
    let processed = 0;
    let failed = [];
    
    try {
        const total = emails.length;
        
        // Process emails one by one
        for (const email of emails) {
            try {
                await sendEmail(email, subject, message);
                processed++;
                
                // Update progress after each email
                await job.progress({
                    total,
                    processed,
                    failed: failed.length
                });
                
                // Add a small delay between emails
                await new Promise(resolve => setTimeout(resolve, 1000));
                
            } catch (error) {
                failed.push({
                    email,
                    error: error.message
                });
                console.error(`Failed to send email to ${email}:`, error);
            }
        }
        
        // Final progress update
        await job.progress({
            total,
            processed,
            failed: failed.length
        });
        
        // If all emails failed, throw error
        if (processed === 0) {
            throw new Error('All emails failed to send');
        }
        
        return {
            total,
            processed,
            failed
        };
    } catch (error) {
        throw new Error(`Job failed: ${error.message}`);
    }
});

const sendMailFromAdmin = async (req, res, next) => {
    try {
        const { message, subject, email } = req.body;
        await sendEmail(email, subject, message);
        return res.status(statusCodes.OK).json({
            status: 'Success',
            message: 'Email sent successfully',
        });
    } catch (error) {
        next(error);
    }
};

const sendAnnouncement = async (req, res, next) => {
    try {
        const { message, subject } = req.body;
        
        const users = await User.find({ status: 'active', isAdmin: false }, 'email');
        const emails = users.map(user => user.email);

        const job = await emailQueue.add({
            emails,
            subject,
            message
        });

        return res.status(statusCodes.OK).json({
            status: 'Success',
            message: 'Announcement queued for delivery to all users',
            jobId: job.id,
            totalEmails: emails.length
        });
    } catch (error) {
        next(error);
    }
};

const getAnnouncementStatus = async (req, res) => {
    try {
        const { jobId } = req.params;
        
        if (!jobId) {
            return res.status(statusCodes.BAD_REQUEST).json({
                status: 'Error',
                message: 'Job ID is required'
            });
        }

        const job = await emailQueue.getJob(jobId);
        
        if (!job) {
            return res.status(statusCodes.NOT_FOUND).json({
                status: 'Error',
                message: 'Job not found'
            });
        }

        const state = await job.getState();
        const progress = await job.progress();

        return res.status(statusCodes.OK).json({
            status: 'Success',
            data: {
                jobId: job.id,
                state,
                progress: progress || {
                    total: 0,
                    processed: 0,
                    failed: 0
                }
            }
        });
    } catch (error) {
        console.error('Error in getAnnouncementStatus:', error);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Error',
            message: 'Internal server error while checking announcement status'
        });
    }
};

module.exports = { sendMailFromAdmin, sendAnnouncement, getAnnouncementStatus };