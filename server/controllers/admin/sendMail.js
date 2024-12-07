const {sendEmail} = require('../../utils/emailService')
const statusCodes = require('../../config/statusCodes')
const sendMailFromAdmin = async (req, res, next) => {
    try {
        const { message, subject, email } = req.body;
        await sendEmail(email ,subject, message);
        return res.status(statusCodes.OK).json({
            status: 'Success',
            message: 'Email sent successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { sendMailFromAdmin };