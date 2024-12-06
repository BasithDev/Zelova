const getRestaurantId = require('../../helpers/getRestaurantId');
const Offers = require('../../models/offers');
const statusCodes = require('../../config/statusCodes');

const addOffer = async (req, res) => {
    try {
        const token = req.cookies.user_token
        const restaurantId = getRestaurantId(token,process.env.JWT_SECRET)
        const { offerName, requiredQuantity, discountAmount } = req.body;
        const newOffer = new Offers({ 
            offerName, 
            requiredQuantity, 
            discountAmount, 
            restaurantId 
        });
        await newOffer.save();
        res.status(statusCodes.CREATED).json({ message: 'Offer added successfully!' });
    } catch (error) {
        console.error('Error adding offer:', error);
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error. Please try again later.' });
    }
};

const getOffers = async (req, res) => {
    try {
        const token = req.cookies.user_token
        const restaurantId = getRestaurantId(token,process.env.JWT_SECRET)
        if (!restaurantId) {
            return res.status(statusCodes.BAD_REQUEST).json({ message: 'Restaurant ID is required.' });
        }
        const offers = await Offers.find({ restaurantId });
        if (!offers || offers.length === 0) {
            return res.status(statusCodes.NOT_FOUND).json({ message: 'No offers found for this restaurant.' });
        }
        res.status(statusCodes.OK).json({ offers });
    } catch (error) {
        console.error('Error fetching offers:', error);
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error. Please try again later.' });
    }
};

const deleteOffer = async (req, res) => {
    const { offerId } = req.params;
    try {
        const offer = await Offers.findByIdAndDelete(offerId);
        if (!offer) return res.status(statusCodes.NOT_FOUND).json({ message: 'Offer not found' });
        res.status(statusCodes.OK).json({ message: 'Offer deleted successfully' });
    } catch (error) {
        console.error('Error deleting offer:', error);
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error. Please try again later.' });
    }
};
module.exports = { addOffer, getOffers, deleteOffer };