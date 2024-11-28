const Cart = require('../../models/cart');

exports.getCart = async (req, res) => {
    try {
        const token = req.cookies.user_token;
        const userId = getUserId(token, process.env.JWT_SECRET);
        const cart = await Cart.findOne({ userId }).populate('items.item');
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
        let cart = await Cart.findOne({ userId });
        const { items } = req.body;

        if (!items || items.length === 0) {
            if (cart) {
                await Cart.deleteOne({ _id: cart._id });
                return res.json({ message: 'Cart deleted successfully' });
            }
            return res.json({ message: 'Cart is already empty' });
        }

        cart = cart ? { ...cart, items } : new Cart({ userId, items });

        await cart.save();

        const updatedCart = await Cart.findById(cart._id).populate('items.item');
        res.json({ 
            message: 'Cart updated successfully', 
            cart: updatedCart 
        });

    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}