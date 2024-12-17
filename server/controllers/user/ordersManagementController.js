const Order = require('../../models/orders')
const Restaurant = require('../../models/restaurant')
const Coupon = require('../../models/coupons')
const zcoin = require('../../models/zcoin')
const RedeemedCoupon = require('../../models/reedemedCoupon')
const Cart = require('../../models/cart')
const getUserId = require('../../helpers/userIdHelper')
const crypto = require('crypto');
const Razorpay = require('razorpay');
const statusCodes = require('../../config/statusCodes');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

function generateRandomCoins(amt) {
    const baseMultiplier = 0.01; 
    const minVariation = 0.8;
    const maxVariation = 1.2;
    let baseCoins = Math.floor(amt * baseMultiplier);
    const randomFactor = minVariation + (Math.random() * (maxVariation - minVariation));
    let finalCoins = Math.floor(baseCoins * randomFactor);
    const minCoins = 1; 
    finalCoins = Math.max(finalCoins, minCoins);
    const maxCoins = 100; 
    finalCoins = Math.min(finalCoins, maxCoins);
    return finalCoins;
}

function generateOrderId() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ZEL-${year}${month}${day}-${random}`;
}

const placeOrder = async (req, res, next) => {
    try {
        const token = req.cookies.user_token;
        if (!token) {
            return res.status(statusCodes.UNAUTHORIZED).json({ message: 'Not authorized' });
        }
        const userId = getUserId(token, process.env.JWT_SECRET);
        
        const { user, items, billDetails, restaurantId, couponCode, cartId } = req.body;

        const paymentMethod = billDetails.paymentMethod;

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
                return res.status(statusCodes.BAD_REQUEST).json({ 
                    success: false,
                    message: 'Invalid coupon code'
                });
            }
            orderData.usedCoupon = {
                code: couponCode
            };
        }

        if (paymentMethod === 'ZCOINS') {
            const userCoins = await zcoin.findOne({ userId });
            if (!userCoins || userCoins.balance < billDetails.finalAmount) {
                return res.status(statusCodes.BAD_REQUEST).json({
                    success: false,
                    message: 'Insufficient Zcoins balance'
                });
            }
            const deductedCoins = Math.floor(-billDetails.finalAmount);
            await zcoin.updateOne(
                { userId },
                { $inc: { balance: deductedCoins } }
            );
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
        const generatedCoins = generateRandomCoins(billDetails.finalAmount);
        if (paymentMethod !== 'ZCOINS') {

            await zcoin.findOneAndUpdate(
                { userId },
                { $inc: { balance: generatedCoins } },
                { upsert: true, new: true }
            );
        }

        res.status(statusCodes.CREATED).json({
            success: true,
            message: 'Order placed successfully',
            order,
            coinsEarned: paymentMethod === 'ZCOINS' ? 0 : generatedCoins
        });

    } catch (error) {
        console.error('Error placing order:', error);
        next(error);
    }
}

const getCurrentOrders = async (req, res, next) => {
    try {
        const token = req.cookies.user_token;
        if (!token) {
            return res.status(statusCodes.UNAUTHORIZED).json({ message: 'Not authorized' });
        }
        const userId = getUserId(token, process.env.JWT_SECRET);
        const orders = await Order.find({ userId, status: { $ne: 'ORDER ACCEPTED' } });
        res.status(statusCodes.OK).json({ 
            success: true,
            message: 'Orders retrieved successfully',
            orders
        });
    } catch (error) {
        console.error('Error retrieving orders:', error);
        next(error);
    }
}

const createRazorpayOrder = async (req, res, next) => {
    try {
        const token = req.cookies.user_token;
        if (!token) {
            return res.status(statusCodes.UNAUTHORIZED).json({ message: 'Not authorized' });
        }
        const userId = getUserId(token, process.env.JWT_SECRET);

        if (!userId) {
            return res.status(statusCodes.BAD_REQUEST).json({ message: 'User ID is required' });
        }
        
        const { amount } = req.body;

        const options = {
            amount: Math.round(amount * 100),
            currency: 'INR',
            receipt: 'receipt_' + Math.random().toString(36).substring(7),
        };

        const razorpayOrder = await razorpay.orders.create(options);

        res.status(statusCodes.OK).json({
            success: true,
            order: razorpayOrder
        });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        next(error);
    }
};

const getPreviousOrdersOnDate = async (req, res, next) => {
    try {
        const token = req.cookies.user_token;
        if (!token) {
            return res.status(statusCodes.UNAUTHORIZED).json({ message: 'Not authorized' });
        }
        const userId = getUserId(token, process.env.JWT_SECRET);
        if (!userId) {
            return res.status(statusCodes.BAD_REQUEST).json({ message: 'User ID is required'});
        }
        const { date } = req.params;
        const searchDate = new Date(date);
        const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));

        const orders = await Order.find({ 
            userId,
            status: 'ORDER ACCEPTED',
            createdAt: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });
        
        res.status(statusCodes.OK).json({ 
            success: true,
            message: 'Orders retrieved successfully',
            orders 
        });
    } catch (error) {
        console.error('Error in getPreviousOrdersOnDate:', error);
        next(error);
    }
};

const verifyRazorpayPayment = async (req, res, next) => {
    try {
        const token = req.cookies.user_token;
        if (!token) {
            return res.status(statusCodes.UNAUTHORIZED).json({ message: 'Not authorized' });
        }
        const userId = getUserId(token, process.env.JWT_SECRET);

        const { 
            razorpay_order_id, 
            razorpay_payment_id, 
            razorpay_signature,
            orderDetails 
        } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderDetails) {
            return res.status(statusCodes.BAD_REQUEST).json({
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
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: 'Invalid payment signature'
            });
        }

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

        // Generate and award coins for Razorpay payment
        const generatedCoins = generateRandomCoins(orderDetails.billDetails.finalAmount);
        console.log('Generated coins:', generatedCoins);
        await zcoin.findOneAndUpdate(
            { userId },
            { $inc: { balance: generatedCoins } },
            { upsert: true, new: true }
        );

        res.status(statusCodes.OK).json({
            success: true,
            message: 'Payment verified successfully',
            order,
            coinsEarned: generatedCoins
        });
    } catch (error) {
        console.error('Error verifying payment:', error);
        next(error);
    }
};

const updateOrderStatus = async (req, res, next) => {
    try {
        const token = req.cookies.user_token;
        if (!token) {
            return res.status(statusCodes.UNAUTHORIZED).json({ message: 'Not authorized' })
        }
        const { orderId, status } = req.body;
        const updatedOrder = await Order.findOneAndUpdate(
            { orderId: orderId },
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

const rateRestaurant = async (req,res,next) => {
    try {
        const token = req.cookies.user_token;
        if (!token) {
            return res.status(statusCodes.UNAUTHORIZED).json({ message: 'Not authorized' })
        }
        const { orderId,restaurantId, rating } = req.body;
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(statusCodes.NOT_FOUND).json({ message: 'Restaurant not found' });
        }
        restaurant.totalRatings += rating;
        restaurant.totalRatingCount += 1; 
        restaurant.avgRating = restaurant.totalRatings / restaurant.totalRatingCount; 
        await restaurant.save();
        const order = await Order.findById(orderId);
        if (order) {
            order.restaurantRate.value = rating;
            order.restaurantRate.status = true;
            await order.save();
        }else{
            return res.status(statusCodes.NOT_FOUND).json({ message: 'Order not found' });
        }
        res.status(statusCodes.OK).json({ message: 'Resturant rating updated successfully' });
    } catch (error) {
        console.error('Error rating order:', error);
        next(error);
    }
}


module.exports = {
    placeOrder,
    getCurrentOrders,
    createRazorpayOrder,
    getPreviousOrdersOnDate,
    verifyRazorpayPayment,
    updateOrderStatus,
    rateRestaurant
};