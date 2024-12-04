const Order = require('../../models/orders')
const Coupon = require('../../models/coupons')
const RedeemedCoupon = require('../../models/reedemedCoupon')
const Cart = require('../../models/cart') // Assuming Cart model is in this location
const {getUserId} = require('../../helpers/getUserId')

exports.placeOrder = async (req, res) => {
    try {
        const token = req.cookies.user_token;
        if (!token) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        const userId = getUserId(token, process.env.JWT_SECRET);
        
        const { user, items, billDetails, restaurantId, couponCode, cartId } = req.body;

        const orderData = {
            userId,
            restaurantId,
            user,
            items,
            billDetails,
            rating: 0,
            status: 'PENDING' 
        };

        if (couponCode) {
            const coupon = await Coupon.findOne({ code: couponCode });
            if (!coupon) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Invalid coupon code'
                });
            }
            orderData.usedCoupon = {
                code: couponCode
            };
        }

        const order = await Order.create(orderData);

        await Cart.deleteOne({ _id: cartId });

        if (couponCode) {
            const coupon = await Coupon.findOne({ code: couponCode });
            await RedeemedCoupon.create({
                userId,
                couponId: coupon._id
            });
        }

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            order
        });

    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to place order',
            error: error.message 
        });
    }
}
exports.getCurrentOrders = async (req, res) => {
    try {
        const token = req.cookies.user_token;
        if (!token) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        const userId = getUserId(token, process.env.JWT_SECRET);
        const orders = await Order.find({ userId, status: { $ne: 'ORDER ACCEPTED' } });
        res.status(200).json({ 
            success: true,
            message: 'Orders retrieved successfully',
            orders
        });
    } catch (error) {
        console.error('Error retrieving orders:', error);
        res.status(500).json({ message: 'Failed to retrieve orders',});
    }
}
exports.getPreviousOrdersOnDate = async (req, res) => {
    try {
        const token = req.cookies.user_token;
        if (!token) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        const userId = getUserId(token, process.env.JWT_SECRET);
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required'});
        }
        const { date } = req.params;
        const searchDate = new Date(date);
        const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));

        const orders = await Order.find({ 
            userId,
            status: 'ORDER ACCEPTED',
            updatedAt: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });
        
        res.status(200).json({ 
            success: true,
            message: 'Orders retrieved successfully',
            orders 
        });
    } catch (error) {
        console.error('Error in getPreviousOrdersOnDate:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to retrieve orders',
            error: error.message 
        });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const token = req.cookies.user_token;
        if (!token) {
            return res.status(401).json({ message: 'Not authorized' })
        }
        const { orderId, status } = req.body;
        const updatedOrder = await Order.findOneAndUpdate(
            { orderId: orderId },
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