const Cart = require('../../models/cart');
const {getUserId} = require('../../helpers/getUserId');
exports.getCart = async (req, res) => {
    try {
        const token = req.cookies.user_token;
        const userId = getUserId(token, process.env.JWT_SECRET);
        const cart = await Cart.findOne({ userId })
            .populate('items.item')
            .populate('restaurantId', 'name image address');
        res.json({ cart: cart || null });
    } catch (error) {
        console.error('Error getting cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getTotalItemsFromCart = async (req, res) => {
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

exports.getTotalPriceFromCart = async (req, res) => {
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
exports.updateCart = async (req, res) => {
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
            // Update existing cart
            const itemIndex = cart.items.findIndex(item => item.item.toString() === itemId);

            if (itemIndex === -1) {
                // Add new item
                cart.items.push({
                    item: itemId,
                    quantity: action === 'add' ? 1 : 0,
                    selectedCustomizations: selectedCustomizations || [],
                });
            } else {
                // Update quantity for existing item
                if (action === 'add') {
                    cart.items[itemIndex].quantity += 1;
                } else if (action === 'remove') {
                    cart.items[itemIndex].quantity -= 1;
                    if (cart.items[itemIndex].quantity <= 0) {
                        cart.items.splice(itemIndex, 1);
                    }
                }
            }

            // If cart is empty after updates, delete it
            if (cart.items.length === 0) {
                await Cart.findByIdAndDelete(cart._id);
                return res.json({ message: 'Cart is empty and deleted.' });
            }
        }

        // Save cart (middleware ensures validation and restaurantId consistency)
        await cart.save();

        // Return updated cart
        const updatedCart = await Cart.findById(cart._id).populate('items.item');
        res.json({ message: 'Cart updated successfully', cart: updatedCart });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};