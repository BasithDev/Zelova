const Restaurant = require('../../models/restaurant')
const testLat = 9.9425176; // Latitude
const testLong = 76.3289828;
const getNearbyRestaurantsFromDB = async (userLat, userLong, maxDistance = 5000) => {
    try {
        const nearbyRestaurants = await Restaurant.aggregate([
            {
                $geoNear: {
                    near: { type: "Point", coordinates: [userLat,userLong] },
                    distanceField: "distance",
                    maxDistance: maxDistance,
                    spherical: true,
                }
            }
        ]);
        
        return nearbyRestaurants;
    } catch (error) {
        console.error("Error fetching nearby restaurants:", error);
    }
};

exports.getRestaurants = async (req,res) =>{
    const {lat,lon} = req.query

    if (!lat || !lon) {
        return res.status(400).json({ error: "Latitude and Longitude are required." });
      }
    
    try {
        const restaurant_res = await getNearbyRestaurantsFromDB(parseFloat(lat),parseFloat(lon))
        res.status(200).json(restaurant_res)
    } catch (error) {
        console.log(error)
        res.status(500).json({error:error.message})
    }
}