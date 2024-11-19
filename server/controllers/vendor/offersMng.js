const Offers = require('../../models/offers');

exports.addOffer = async (req, res) => {
    try {
        const { offerName, requiredQuantity, discountAmount, restaurantId } = req.body;
        const newOffer = new Offers({ 
            offerName, 
            requiredQuantity, 
            discountAmount, 
            restaurantId 
        });
        await newOffer.save();
        res.status(201).json({ message: 'Offer added successfully!' });
    } catch (error) {
        console.error('Error adding offer:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

exports.getOffers = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        if (!restaurantId) {
            return res.status(400).json({ message: 'Restaurant ID is required.' });
        }
        const offers = await Offers.find({ restaurantId });
        if (!offers || offers.length === 0) {
            return res.status(404).json({ message: 'No offers found for this restaurant.' });
        }
        res.status(200).json({ offers });
    } catch (error) {
        console.error('Error fetching offers:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

exports.deleteOffer = async (req, res) => {
    const { offerId } = req.params;
    try {
        const offer = await Offers.findByIdAndDelete(offerId);
        if (!offer) return res.status(404).json({ message: 'Offer not found' });
        res.status(200).json({ message: 'Offer deleted successfully' });
    } catch (error) {
        console.error('Error deleting offer:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};