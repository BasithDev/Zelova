const Cart = require('../../models/cart');
const {getUserId} = require('../../helpers/getUserId');
const Restaurant = require('../../models/restaurant');
const mongoose = require('mongoose');
const getCart = async (req, res) => {
    try {
        const token = req.cookies.user_token;
        const userId = getUserId(token, process.env.JWT_SECRET);
        const cart = await Cart.findOne({ userId })
            .populate({
                path: 'items.item',
                populate: {
                    path: 'offers',
                    select: 'offerName requiredQuantity discountAmount'
                }
            })
            .populate('restaurantId', 'name image address');

        res.json({ cart: cart || null });
    } catch (error) {
        console.error('Error getting cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getTotalItemsFromCart = async (req, res) => {
    try {
        const token = req.cookies.user_token;
        const userId = getUserId(token, process.env.JWT_SECRET);
        const cart = await Cart.findOne({ userId });
        res.json({ totalItems: cart ? cart.totalItems : 0 });
    } catch (error) {
        console.error('Error getting cart total items:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getTotalPriceFromCart = async (req, res) => {
    try {
        const token = req.cookies.user_token;
        const userId = getUserId(token, process.env.JWT_SECRET);
        const cart = await Cart.findOne({ userId });
        res.json({ totalPrice: cart ? cart.totalPrice : 0 });
    } catch (error) {
        console.error('Error getting cart total price:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
const updateCart = async (req, res) => {
    try {
        const token = req.cookies.user_token;
        const userId = getUserId(token, process.env.JWT_SECRET);
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { itemId, action, selectedCustomizations } = req.body;
        if (!itemId || !action) {
            return res.status(400).json({ message: 'Item ID and action are required.' });
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = await Cart.create({
                userId,
                items: [{
                    item: itemId,
                    quantity: action === 'add' ? 1 : 0,
                    selectedCustomizations: selectedCustomizations || [],
                }],
            });
        } else {
            const itemIndex = cart.items.findIndex(item => item.item.toString() === itemId);

            if (itemIndex === -1) {
                cart.items.push({
                    item: itemId,
                    quantity: action === 'add' ? 1 : 0,
                    selectedCustomizations: selectedCustomizations || [],
                });
            } else {
                if (action === 'add') {
                    cart.items[itemIndex].quantity += 1;
                } else if (action === 'remove') {
                    cart.items[itemIndex].quantity -= 1;
                    if (cart.items[itemIndex].quantity <= 0) {
                        cart.items.splice(itemIndex, 1);
                    }
                }
            }

            if (cart.items.length === 0) {
                await Cart.findByIdAndDelete(cart._id);
                return res.json({ message: 'Cart is empty and deleted.' });
            }
        }

        await cart.save();

        const updatedCart = await Cart.findById(cart._id).populate('items.item');
        res.json({ message: 'Cart updated successfully', cart: updatedCart });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
const generateDeliveryFee = async (req, res) => {
    try {
        const token = req.cookies.user_token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const userId = getUserId(token, process.env.JWT_SECRET);
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        let { lat, lon, restaurantId } = req.query;
        if (!lat || !lon || !restaurantId) {
            return res.status(400).json({ message: 'Latitude, Longitude, and Restaurant ID are required' });
        }

        lat = parseFloat(lat);
        lon = parseFloat(lon);


        try {
            const distanceResult = await Restaurant.aggregate([
                {
                    $geoNear: {
                        near: { type: "Point", coordinates: [lat, lon] },
                        distanceField: "distance",
                        spherical: true,
                        maxDistance: 50000
                    }
                },
                {
                    $match: { _id: new mongoose.Types.ObjectId(restaurantId) }
                }
            ]);

            if (!distanceResult.length) {
                return res.status(404).json({ message: 'Distance calculation failed' });
            }

            const deliveryFee = (distanceResult[0].distance / 1000) * 8;

            res.json({ deliveryFee });
        } catch (error) {
            console.error('Error during distance calculation:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    } catch (error) {
        console.error('Error getting delivery fee:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    getCart,
    getTotalItemsFromCart,
    getTotalPriceFromCart,
    updateCart,
    generateDeliveryFee
}