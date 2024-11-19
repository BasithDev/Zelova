const Restaurant = require('../../models/restaurant')
const cloudinary = require('cloudinary').v2;

exports.getRestaurant = async (req, res) => {
    try {
      const { userId } = req.params;
      if (!userId) return res.status(400).json({ error: "User ID is required" });
      const restaurant = await Restaurant.findOne({ vendorId: userId });
      if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });
      res.status(200).json({ restaurant });
    } catch (error) {
      console.error("Error fetching restaurant:", error);
      res.status(500).json({ error: "An error occurred while fetching restaurant data" });
    }
};

exports.updateRestaurantDetails = async (req,res)=>{
  const { userId } = req.params;
  const { name, description, phone, openingTime, closingTime } = req.body;

  if (!userId || !name || !description || !phone || !openingTime || !closingTime) {
      return res.status(400).json({ error: "Invalid input. All fields are required." });
  }

  try {
      const updatedRestaurant = await Restaurant.findOneAndUpdate(
          { vendorId: userId },
          { name, description, phone, openingTime, closingTime },
          { new: true }
      );

      if (!updatedRestaurant) return res.status(404).json({ error: "Restaurant not found" });

      res.status(200).json({ message: "Restaurant details updated successfully" });
  } catch (error) {
      res.status(500).json({ error: "Error updating restaurant details" });
  }
}

exports.openOrCloseShop = async (req,res)=>{
  const { userId } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
        return res.status(400).json({ error: "Valid isActive status (true or false) is required." });
    }

    try {
        const updatedRestaurant = await Restaurant.findOneAndUpdate(
            { vendorId: userId },
            { isActive },
            { new: true }
        );

        if (!updatedRestaurant) return res.status(404).json({ error: "Restaurant not found" });

        res.status(200).json({ 
            message: `Restaurant is now ${isActive ? "open" : "closed"}.`,
            restaurant: updatedRestaurant 
        });
    } catch (error) {
        res.status(500).json({ error: "Error updating restaurant status." });
    }
}

exports.updateRestaurantPic = async (req,res)=>{
  const { userId } = req.params;
    const { imageURL , public_id } = req.body;

    if (!userId || !imageURL) {
        return res.status(400).json({ error: "User ID and image URL are required." });
    }

    try {
        const image = imageURL
        const updatedRestaurant = await Restaurant.findOneAndUpdate(
            { vendorId: userId },
            { image },
            { new: true }
        );

        await cloudinary.uploader.destroy(public_id);

        if (!updatedRestaurant) return res.status(404).json({ error: "Restaurant not found" });

        res.status(200).json({ message: "Restaurant image updated successfully", restaurant: updatedRestaurant });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error updating restaurant image" });
    }
}

exports.setLocation = async (req,res)=>{
  const { userId } = req.params;
    const { address, coordinates } = req.body;

    if (!userId || !address || !coordinates) {
        return res.status(400).json({ error: "Invalid input. User ID, address, and valid coordinates are required." });
    }

    const transformedCoordinates = [coordinates.lat, coordinates.lng];

    try {
        const updatedRestaurant = await Restaurant.findOneAndUpdate(
            { vendorId: userId },
            { location: { type: "Point", coordinates: transformedCoordinates }, address },
            { new: true }
        );
        if (!updatedRestaurant) return res.status(404).json({ error: "Restaurant not found" });

        res.status(200).json({ message: "Location updated successfully", restaurant: updatedRestaurant });
    } catch (error) {
      console.log(error)
        res.status(500).json({ error: "Error updating location" });
    }
}