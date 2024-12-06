const Orders = require('../../models/orders')
const {getUserId} = require('../../helpers/getUserId')
const getRestaurantId = require('../../helpers/getRestaurantId')

const getCurrentOrdersForVendor = async (req,res) =>{
    const token = req.cookies.user_token
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const vendorId = getUserId(token, process.env.JWT_SECRET)
    if (!vendorId) return res.status(400).json({ error: "User ID is required" });

    const restaurantId = getRestaurantId(token, process.env.JWT_SECRET);
    if (!restaurantId) return res.status(400).json({ error: "Restaurant ID is required" });

    const orders = await Orders.find({ restaurantId, status: { $ne: 'ORDER ACCEPTED' } })

    res.status(200).json(orders)
}
const updateOrderStatus = async (req, res) => {
    try {
        const token = req.cookies.user_token;
        if (!token) {
            return res.status(401).json({ message: 'Not authorized' })
        }
        const { orderId, status } = req.body;
        const updatedOrder = await Orders.findOneAndUpdate(
            { orderId },
            { status },
            { new: true }
        );
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order status updated successfully', order: updatedOrder });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Failed to update order status', error: error.message });
    }
};
module.exports = {
    getCurrentOrdersForVendor,
    updateOrderStatus
}