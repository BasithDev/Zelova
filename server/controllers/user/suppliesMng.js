const supplies = require('../../models/Supplies')
const statusCodes = require('../../config/statusCodes');
const getUserId = require('../../helpers/getUserId')

const shareSupplies = async (req, res, next) => {
    try {
        const token = req.cookies.user_token;
        if (!token) {
            return res.status(statusCodes.UNAUTHORIZED).json({ message: 'Not authorized' });
        }
        const userId = getUserId(token, process.env.JWT_SECRET);
        const { heading, description , lon , lat } = req.body;
        const newSupply = new supplies({
            userId,
            heading,
            description,
            location: {
                coordinates: [lon, lat],
            },
        });
        await newSupply.save();
        return res.status(statusCodes.OK).json({ message: 'Supply shared successfully' });
    } catch (error) {
        console.error('Error sharing supply:', error);
        next(error);
    }
};

const viewSharedSupplies = async (req, res, next) => {
    try {
        const token = req.cookies.user_token;
        if (!token) {
            return res.status(statusCodes.UNAUTHORIZED).json({ message: 'Not authorized' });
        }
        const userId = getUserId(token, process.env.JWT_SECRET);
        const sharedSupplies = await supplies.find({ userId });
        res.status(statusCodes.OK).json({ sharedSupplies });
    } catch (error) {
        console.error('Error retrieving shared supplies:', error);
        next(error);
    }
}



module.exports = {
    shareSupplies,
    viewSharedSupplies
}