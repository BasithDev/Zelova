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
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(statusCodes.BAD_REQUEST).json({ error: "Invalid restaurant ID" });
    }

    try {
        const menu = await FoodItem.find({ restaurantId: id });
        if (!menu) {
            return res.status(statusCodes.NOT_FOUND).json({ error: "Menu not found" });
        }
        res.status(statusCodes.OK).json(menu);
    } catch (error) {
        console.error("Error fetching menu:", error);
        next(error);
    }
};

module.exports = {
    getRestaurants,
    getMenu
}