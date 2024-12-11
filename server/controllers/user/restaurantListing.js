const Restaurant = require('../../models/restaurant')
const FoodItem = require('../../models/foodItem');
const mongoose = require('mongoose');
const statusCodes = require('../../config/statusCodes');

const getNearbyRestaurantsFromDB = async (userLat, userLong, maxDistance = 50000) => {
    try {
        const nearbyRestaurants = await Restaurant.aggregate([
            {
                $geoNear: {
                    near: { type: "Point", coordinates: [userLat, userLong] },
                    distanceField: "distance",
                    maxDistance: maxDistance,
                    spherical: true,
                }
            },
            {
                $lookup: {
                    from: 'offers',
                    localField: '_id',
                    foreignField: 'restaurantId',
                    as: 'offers'
                }
            },
            {
                $addFields: {
                    offerName: { $arrayElemAt: ['$offers.offerName', 0] }
                }
            },
            {
                $project: {
                    offers: 0
                }
            }
        ]);
        return nearbyRestaurants;
    } catch (error) {
        console.error("Error fetching nearby restaurants:", error);
        throw error;
    }
};

const getRestaurants = async (req, res, next) => {
    const { lat, lon } = req.query

    if (!lat || !lon) {
        return res.status(statusCodes.BAD_REQUEST).json({ error: "Latitude and Longitude are required." });
    }

    try {
        const restaurant_res = await getNearbyRestaurantsFromDB(parseFloat(lat), parseFloat(lon))
        res.status(statusCodes.OK).json(restaurant_res)
    } catch (error) {
        console.error("Error fetching restaurants:", error);
        next(error);
    }
}

const getMenu = async (req, res, next) => {
    const { id } = req.params;
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(statusCodes.BAD_REQUEST).json({ error: "Latitude and Longitude are required." });
    }

    try {
        const restaurant = await Restaurant.aggregate([
            {
                $geoNear: {
                    near: { type: "Point", coordinates: [parseFloat(lat), parseFloat(lon)] },
                    distanceField: "distance",
                    maxDistance: 50000,
                    spherical: true,
                    query: { _id: new mongoose.Types.ObjectId(id) }
                }
            },
            {
                $project: {
                    name: 1,
                    rating: 1,
                    address: 1,
                    distance: 1,
                    phone: 1,
                    image: 1
                }
            }
        ]);

        if (!restaurant || restaurant.length === 0) {
            return res.status(statusCodes.NOT_FOUND).json({ message: 'Restaurant not found' });
        }
        const menu = await FoodItem.find({ restaurantId: id , isActive: true })
            .populate('foodCategory')
            .populate('offers')
            .lean();
        res.status(statusCodes.OK).json({
            restaurant: restaurant[0],
            menu
        });
    } catch (error) {
        console.error('Error fetching menu:', error);
        next(error);
    }
}

module.exports = {
    getRestaurants,
    getMenu
}