const Orders = require('../../models/orders')
const { getUserId } = require('../../helpers/getUserId')
const getRestaurantId = require('../../helpers/getRestaurantId')

exports.getOrdersForVendor = async (req, res) => {
    const token = req.cookies.user_token
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const vendorId = getUserId(token, process.env.JWT_SECRET)
    if (!vendorId) return res.status(400).json({ error: "User ID is required" });
    const restaurantId = getRestaurantId(token, process.env.JWT_SECRET);
    if (!restaurantId) return res.status(400).json({ error: "Restaurant ID is required" });
    const orders = await Orders.find({ restaurantId })
    if (!orders) return res.status(404).json({ error: "No orders found" });
    res.status(200).json(orders)
}