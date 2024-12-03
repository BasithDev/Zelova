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