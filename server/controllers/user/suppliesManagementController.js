const Supplies = require('../../models/Supplies');
const statusCodes = require('../../config/statusCodes');
const getUserId = require('../../helpers/userIdHelper');

const getNearBySupplies = async (req, res, next) => {
    try {
        const { lon, lat } = req.query;
        const nearbySupplies = await Supplies.aggregate([
            {
                $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: [parseFloat(lon), parseFloat(lat)],
                    },
                    distanceField: 'distance',
                    spherical: true,
                    maxDistance: 50000,
                },
            },
            {
                $project: {
                    userId: 1,
                    contactNumber: 1,
                    heading: 1,
                    description: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    distance: { $divide: ['$distance', 1000] },
                },
            },
        ]);
        res.status(statusCodes.OK).json({ supplies: nearbySupplies });
    } catch (error) {
        console.error('Error retrieving supplies:', error);
        next(error);
    }
};

const shareSupplies = async (req, res, next) => {
    try {
        const token = req.cookies.user_token;
        if (!token) {
            return res.status(statusCodes.UNAUTHORIZED).json({ message: 'Not authorized' });
        }
        const userId = getUserId(token, process.env.JWT_SECRET);
        const { heading, description, lon, lat, contactNumber } = req.body;
        const newSupply = new Supplies({
            userId,
            heading,
            contactNumber,
            description,
            location: {
                coordinates: [lon, lat],
            },
        });
        await newSupply.save();
        return res.status(statusCodes.OK).json({ message: 'Supply shared successfully',
         supply: newSupply
         });
    } catch (error) {
        console.error('Error sharing supply:', error);
        next(error);
    }
};

const updateSupplies = async (req, res, next) => {
    try {
        const token = req.cookies.user_token;
        if (!token) {
            return res.status(statusCodes.UNAUTHORIZED).json({ message: 'Not authorized' });
        }
        const { supplyId, heading, description, contactNumber } = req.body;

        const updatedSupply = await Supplies.findOneAndUpdate(
            { _id: supplyId },
            { heading, description, contactNumber },
            { new: true }
        );
        if (!updatedSupply) {
            return res.status(statusCodes.NOT_FOUND).json({ message: 'Supply not found' });
        }
        res.status(statusCodes.OK).json({ message: 'Supply updated successfully', supply: updatedSupply });
    } catch (error) {
        console.error('Error updating supply:', error);
        next(error);
    }
};

const deleteSupplies = async (req, res, next) => {
    try {
        const token = req.cookies.user_token;
        if (!token) {
            return res.status(statusCodes.UNAUTHORIZED).json({ message: 'Not authorized' });
        }
        const { id } = req.query;

        const deletedSupply = await Supplies.findByIdAndDelete(id);
        if (!deletedSupply) {
            return res.status(statusCodes.NOT_FOUND).json({ message: 'Supply not found' });
        }
        res.status(statusCodes.OK).json({ message: 'Supply deleted successfully' });
    } catch (error) {
        console.error('Error deleting supply:', error);
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
        const sharedSupplies = await Supplies.find({ userId });
        res.status(statusCodes.OK).json({ sharedSupplies });
    } catch (error) {
        console.error('Error retrieving shared supplies:', error);
        next(error);
    }
};

module.exports = {
    shareSupplies,
    viewSharedSupplies,
    updateSupplies,
    deleteSupplies,
    getNearBySupplies
};