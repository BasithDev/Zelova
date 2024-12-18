const favorites = require('../../models/favorite');
const statusCodes = require('../../config/statusCodes');
const getUserId  = require('../../helpers/userIdHelper');

const addFavorite = async (req, res, next) => {
    try {
        const token = req.cookies.user_token;
        if (!token) {
            return res.status(statusCodes.UNAUTHORIZED).json({ message: 'Not authorized' });
        }
        const userId = getUserId(token, process.env.JWT_SECRET);
        const { foodItemId } = req.body;
        const favorite = await favorites.create({
            item: foodItemId,
            userId,
        });
        if (!favorite) {
            return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to add favorite' });
        }
        res.status(statusCodes.OK).json({ message: 'Favorite added successfully' });
    } catch (error) {
        console.error('Error adding favorite:', error);
        next(error);
    }
};

const removeFavorite = async (req, res, next) => {
    try {
        const token = req.cookies.user_token;
        if (!token) {
            return res.status(statusCodes.UNAUTHORIZED).json({ message: 'Not authorized' });
        }
        const userId = getUserId(token, process.env.JWT_SECRET);
        const { foodItemId } = req.query;
        const favorite = await favorites.findOneAndDelete({ item: foodItemId, userId });
        if (!favorite) {
            return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to remove favorite' });
        }
        res.status(statusCodes.OK).json({ message: 'Favorite removed successfully' });
    } catch (error) {
        console.error('Error removing favorite:', error);
        next(error);
    }
};

const getFavorites = async (req, res, next) => {
    try {
        const token = req.cookies.user_token;
        if (!token) {
            return res.status(statusCodes.UNAUTHORIZED).json({ message: 'Not authorized' });
        }
        const userId = getUserId(token, process.env.JWT_SECRET);
        const favoritesRes = await favorites.find({ userId }).populate({
            path: 'item',
            populate: [{
                path: 'offers',
                model: 'Offer',
                select: 'offerName'
            }, {
                path: 'restaurantId',
                model: 'Restaurant',
                select: '_id name address'
            }],
            select: 'name price description image offers restaurantId'
        })
        res.status(statusCodes.OK).json({ favorites: favoritesRes });
    } catch (error) {
        console.error('Error retrieving favorites:', error);
        next(error);
    }
};

module.exports = {
    addFavorite,
    removeFavorite,
    getFavorites
}