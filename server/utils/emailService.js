const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_DEV,
        pass: process.env.EMAIL_DEV_PASS,
    },
});
const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_DEV,
        to,
        subject,
        text,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error);
        throw error;
    }
};

module.exports = { sendEmail };