const Restaurant = require('../../models/restaurant')
const cloudinary = require('cloudinary').v2;
const {getUserId} = require('../../helpers/getUserId')
const statusCodes = require('../../config/statusCodes');

const getRestaurant = async (req, res) => {
    try {
        const token = req.cookies.user_token
        const userId  = getUserId(token,process.env.JWT_SECRET)
      if (!userId) return res.status(statusCodes.BAD_REQUEST).json({ error: "User ID is required" });
      const restaurant = await Restaurant.findOne({ vendorId: userId });
      if (!restaurant) return res.status(statusCodes.NOT_FOUND).json({ error: "Restaurant not found" });
      res.status(statusCodes.OK).json({ restaurant });
    } catch (error) {
      console.error("Error fetching restaurant:", error);
      res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while fetching restaurant data" });
    }
};

const updateRestaurantDetails = async (req,res)=>{
    const token = req.cookies.user_token
    const userId  = getUserId(token,process.env.JWT_SECRET)
  const { name, description, phone, openingTime, closingTime } = req.body;

  if (!userId || !name || !description || !phone || !openingTime || !closingTime) {
      return res.status(statusCodes.BAD_REQUEST).json({ error: "Invalid input. All fields are required." });
  }

  try {
      const updatedRestaurant = await Restaurant.findOneAndUpdate(
          { vendorId: userId },
          { name, description, phone, openingTime, closingTime },
          { new: true }
      );

      if (!updatedRestaurant) return res.status(statusCodes.NOT_FOUND).json({ error: "Restaurant not found" });

      res.status(statusCodes.OK).json({ message: "Restaurant details updated successfully" });
  } catch (error) {
      res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: "Error updating restaurant details" });
  }
}

const openOrCloseShop = async (req,res)=>{
    const token = req.cookies.user_token
    const userId  = getUserId(token,process.env.JWT_SECRET)
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
        return res.status(statusCodes.BAD_REQUEST).json({ error: "Valid isActive status (true or false) is required." });
    }

    try {
        const updatedRestaurant = await Restaurant.findOneAndUpdate(
            { vendorId: userId },
            { isActive },
            { new: true }
        );

        if (!updatedRestaurant) return res.status(statusCodes.NOT_FOUND).json({ error: "Restaurant not found" });

        res.status(statusCodes.OK).json({ 
            message: `Restaurant is now ${isActive ? "open" : "closed"}.`,
            restaurant: updatedRestaurant 
        });
    } catch (error) {
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: "Error updating restaurant status." });
    }
}

const updateRestaurantPic = async (req,res)=>{
    const token = req.cookies.user_token
    const userId  = getUserId(token,process.env.JWT_SECRET)
    const { imageURL , public_id } = req.body;

    if (!userId || !imageURL) {
        return res.status(statusCodes.BAD_REQUEST).json({ error: "User ID and image URL are required." });
    }

    try {
        const image = imageURL
        const updatedRestaurant = await Restaurant.findOneAndUpdate(
            { vendorId: userId },
            { image },
            { new: true }
        );

        await cloudinary.uploader.destroy(public_id);

        if (!updatedRestaurant) return res.status(statusCodes.NOT_FOUND).json({ error: "Restaurant not found" });

        res.status(statusCodes.OK).json({ message: "Restaurant image updated successfully", restaurant: updatedRestaurant });
    } catch (error) {
        console.log(error)
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: "Error updating restaurant image" });
    }
}

const setLocation = async (req,res)=>{
    const token = req.cookies.user_token
    const userId  = getUserId(token,process.env.JWT_SECRET)
    const { address, coordinates } = req.body;

    if (!userId || !address || !coordinates) {
        return res.status(statusCodes.BAD_REQUEST).json({ error: "Invalid input. User ID, address, and valid coordinates are required." });
    }

    const transformedCoordinates = [coordinates.lat, coordinates.lng];

    try {
        const updatedRestaurant = await Restaurant.findOneAndUpdate(
            { vendorId: userId },
            { location: { type: "Point", coordinates: transformedCoordinates }, address },
            { new: true }
        );
        if (!updatedRestaurant) return res.status(statusCodes.NOT_FOUND).json({ error: "Restaurant not found" });

        res.status(statusCodes.OK).json({ message: "Location updated successfully", restaurant: updatedRestaurant });
    } catch (error) {
      console.log(error)
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: "Error updating location" });
    }
}

module.exports = {
    getRestaurant,
    updateRestaurantDetails,
    openOrCloseShop,
    updateRestaurantPic,
    setLocation
}