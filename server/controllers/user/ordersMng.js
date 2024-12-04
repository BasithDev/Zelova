const Order = require('../../models/orders')
const Coupon = require('../../models/coupons')
const RedeemedCoupon = require('../../models/reedemedCoupon')
const Cart = require('../../models/cart')
const {getUserId} = require('../../helpers/getUserId')
const crypto = require('crypto');
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Function to generate orderId
function generateOrderId() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ZEL-${year}${month}${day}-${random}`;
}

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
            status: 'PENDING',
            orderId: generateOrderId()
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
exports.createRazorpayOrder = async (req, res) => {
    try {
        const token = req.cookies.user_token;
        if (!token) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        const userId = getUserId(token, process.env.JWT_SECRET);

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        
        const { amount } = req.body;

        const options = {
            amount: Math.round(amount * 100),
            currency: 'INR',
            receipt: 'receipt_' + Math.random().toString(36).substring(7),
        };

        const razorpayOrder = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            order: razorpayOrder
        });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create payment order'
        });
    }
};
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
exports.verifyRazorpayPayment = async (req, res) => {
    try {
        const token = req.cookies.user_token;
        if (!token) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        const userId = getUserId(token, process.env.JWT_SECRET);

        const { 
            razorpay_order_id, 
            razorpay_payment_id, 
            razorpay_signature,
            orderDetails 
        } = req.body;

        // Validate required fields
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderDetails) {
            return res.status(400).json({
                success: false,
                message: 'Missing required payment details'
            });
        }

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature !== expectedSign) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment signature'
            });
        }

        // Generate orderId
        const orderId = generateOrderId();

        const finalOrderDetails = {
            ...orderDetails,
            userId,
            orderId,
            paymentDetails: {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature
            },
            status: 'PAID'
        };

        const order = await Order.create(finalOrderDetails);
        
        if (orderDetails.cartId) {
            await Cart.deleteOne({ _id: orderDetails.cartId });
        }

        res.status(200).json({
            success: true,
            message: 'Payment verified successfully',
            order
        });
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({
            success: false,
            message: 'Payment verification failed',
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