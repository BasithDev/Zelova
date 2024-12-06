const Restaurant = require('../../models/restaurant')
const FoodItem = require('../../models/fooditem');
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
    }
};

const getRestaurants = async (req,res) =>{
    const {lat,lon} = req.query

    if (!lat || !lon) {
        return res.status(statusCodes.BAD_REQUEST).json({ error: "Latitude and Longitude are required." });
      }
    
    try {
        const restaurant_res = await getNearbyRestaurantsFromDB(parseFloat(lat),parseFloat(lon))
        res.status(statusCodes.OK).json(restaurant_res)
    } catch (error) {
        console.log(error)
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({error:error.message})
    }
}

const getMenu = async (req,res) =>{    
    const {id} = req.params;
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
                    image:1
                }
            }
        ]);

        if (!restaurant || restaurant.length === 0) {
            return res.status(statusCodes.NOT_FOUND).json({ message: 'Restaurant not found' });
        }
        const menu = await FoodItem.find({ restaurantId: id })
            .populate('foodCategory')
            .populate('offers')
            .lean();
        res.status(statusCodes.OK).json({
            restaurant: restaurant[0],
            menu
        });
    } catch (error) {
        console.log(error);
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({error:error.message});
    }
}

module.exports = {
    getRestaurants,
    getMenu
}