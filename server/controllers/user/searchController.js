const foodItems = require('../../models/foodItem');
const statusCodes = require('../../config/statusCodes');

const getProducts = async (req, res, next) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(statusCodes.BAD_REQUEST).json({ error: 'Query parameter is required.' });
        }

        const searchWords = query.trim().split(/\s+/);
        const searchCondition = {
            $or: searchWords.map(word => ({
                name: { $regex: word, $options: 'i' },
                isActive: true
            }))
        };

        const foodItemsRes = await foodItems
            .find(searchCondition)
            .populate({
                path: 'foodCategory',
                select: 'name',
            })
            .populate({
                path: 'offers',
                select: 'offerName',
            }).populate({
                path: 'restaurantId',
                select: 'name address',
            }).select('name price image foodCategory offers restaurantId');

        const categoryMatchItems = await foodItems
            .find()
            .populate({
                path: 'foodCategory',
                match: { 
                    $or: searchWords.map(word => ({
                        name: { $regex: word, $options: 'i' },
                        isActive: true
                    }))
                },
                select: 'name',
            })
            .populate({
                path: 'offers',
                select: 'offerName',
            }).populate({
                path: 'restaurantId',
                select: 'name address',
            }).select('name price image foodCategory offers restaurantId');

        const allItems = [...foodItemsRes, ...categoryMatchItems];
        const uniqueItems = Array.from(new Set(allItems.map(item => item._id.toString())))
            .map(id => allItems.find(item => item._id.toString() === id))
            .filter(item => item.foodCategory);

        res.status(statusCodes.OK).json({ foodItems: uniqueItems });
    } catch (error) {
        console.error('Error fetching products:', error);
        next(error);
    }
};

module.exports = { getProducts };
