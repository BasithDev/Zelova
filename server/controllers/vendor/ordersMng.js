const Orders = require('../../models/orders')
const {getUserId} = require('../../helpers/getUserId')
const getRestaurantId = require('../../helpers/getRestaurantId')
const statusCodes = require('../../config/statusCodes')

const getCurrentOrdersForVendor = async (req,res) =>{
    const token = req.cookies.user_token
    if (!token) return res.status(statusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });

    const vendorId = getUserId(token, process.env.JWT_SECRET)
    if (!vendorId) return res.status(statusCodes.BAD_REQUEST).json({ error: "User ID is required" });

    const restaurantId = getRestaurantId(token, process.env.JWT_SECRET);
    if (!restaurantId) return res.status(statusCodes.BAD_REQUEST).json({ error: "Restaurant ID is required" });

    const orders = await Orders.find({ restaurantId, status: { $ne: 'ORDER ACCEPTED' } })

    res.status(statusCodes.OK).json(orders)
}
const updateOrderStatus = async (req, res, next) => {
    try {
        const token = req.cookies.user_token;
        if (!token) {
            return res.status(statusCodes.UNAUTHORIZED).json({ message: 'Not authorized' })
        }
        const { orderId, status } = req.body;
        const updatedOrder = await Orders.findOneAndUpdate(
            { orderId },
            { status },
            { new: true }
        );
        if (!updatedOrder) {
            return res.status(statusCodes.NOT_FOUND).json({ message: 'Order not found' });
        }
        res.status(statusCodes.OK).json({ message: 'Order status updated successfully', order: updatedOrder });
    } catch (error) {
        console.error('Error updating order status:', error);
        next(error);
    }
};
module.exports = {
    getCurrentOrdersForVendor,
    updateOrderStatus
}