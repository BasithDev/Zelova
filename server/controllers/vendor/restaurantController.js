const Restaurant = require('../../models/restaurant')

exports.getRestaurant = async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) return res.status(400).json({ error: "User ID is required" });
      const restaurant = await Restaurant.findOne({ vendorId: userId });
      if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });
      res.status(200).json({ restaurant });
    } catch (error) {
      console.error("Error fetching restaurant:", error);
      res.status(500).json({ error: "An error occurred while fetching restaurant data" });
    }
};