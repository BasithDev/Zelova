const Cart = require('../../models/cart');
const FoodItem = require('../../models/fooditem');
const { getUserId } = require('../../utils/getUserId');

function calculatePrice(basePrice, customizations) {
    if (!customizations || customizations.length === 0) {
        return basePrice;
    }

    const customizationTotal = customizations.reduce((total, customization) => {
        const optionsTotal = customization.options.reduce((sum, option) => {
            return sum + (option.price || 0);
        }, 0);
        return total + optionsTotal;
    }, 0);

    return basePrice + customizationTotal;
}

exports.getCart = async (req, res) => {
    try {
        const token = req.cookies.user_token
        const userId = getUserId(token, process.env.JWT_SECRET);
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json({ cart });
    } catch (error) {
        console.error('Error getting cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.manageCart = async (req, res) => {
    try {
        const token = req.cookies.user_token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized. No token provided." });
        }
        const userId = getUserId(token, process.env.JWT_SECRET);
        const { itemId, quantity, customizations, offer } = req.body;

        // Validate the food item exists
        const foodItem = await FoodItem.findById(itemId);
        if (!foodItem) {
            return res.status(404).json({ message: "Food item not found" });
        }

        // Find or create cart
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        // Find item in cart
        const existingItemIndex = cart.items.findIndex(
            item => item.itemId.toString() === itemId
        );

        if (existingItemIndex > -1) {
            // Item exists in cart
            if (quantity === 0) {
                // Remove item if quantity is 0
                cart.items.splice(existingItemIndex, 1);
            } else {
                // Update existing item
                cart.items[existingItemIndex] = {
                    ...cart.items[existingItemIndex],
                    quantity,
                    // Update customizations if provided, otherwise keep existing
                    customizations: customizations || cart.items[existingItemIndex].customizations,
                    // Update offer if provided, otherwise keep existing
                    offer: offer || cart.items[existingItemIndex].offer,
                    // Recalculate price based on base price and customizations
                    price: calculatePrice(foodItem.price, customizations)
                };
            }
        } else if (quantity > 0) {
            // Add new item to cart
            cart.items.push({
                itemId,
                quantity,
                price: calculatePrice(foodItem.price, customizations),
                customizations: customizations || [],
                offer: offer || null
            });
        }

        await cart.save();

        // Populate cart items with food item details and offer details
        const populatedCart = await Cart.findById(cart._id)
            .populate('items.itemId', 'name price image')
            .populate('items.offer', 'offerName discountAmount');

        res.status(200).json({
            message: quantity === 0 ? "Item removed from cart" :
                existingItemIndex > -1 ? "Cart updated successfully" : "Item added to cart",
            cart: populatedCart
        });

    } catch (error) {
        console.error("Error managing cart:", error);
        res.status(500).json({ message: "Server error" });
    }
};