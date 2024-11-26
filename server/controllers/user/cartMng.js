const Cart = require('../../models/cart');
const FoodItem = require('../../models/fooditem');
const { getUserId } = require('../../helpers/getUserId');

// Helper function to calculate total price including customizations
function calculateTotalPrice(basePrice, customizations) {
    if (!customizations || customizations.length === 0) {
        return basePrice;
    }

    const customizationTotal = customizations.reduce((total, customization) => {
        const optionsTotal = Object.values(customization.options).reduce((sum, option) => {
            return sum + (option.price || 0);
        }, 0);
        return total + optionsTotal;
    }, 0);

    return basePrice + customizationTotal;
}

// Add or update item quantity in cart
exports.updateCartItem = async (req, res) => {
    try {
        const token = req.cookies.user_token;
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const userId = getUserId(token, process.env.JWT_SECRET);
        const { itemId, quantity, customizations } = req.body;

        const foodItem = await FoodItem.findById(itemId);
        if (!foodItem) return res.status(404).json({ message: "Food item not found" });

        // Use findOneAndUpdate for efficiency
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({
                userId,
                restaurantId: foodItem.restaurantId,
                items: []
            });
        }

        if (cart.restaurantId && cart.restaurantId.toString() !== foodItem.restaurantId.toString()) {
            return res.status(400).json({
                message: "Cannot add items from different restaurants. Clear cart first."
            });
        }

        const existingItemIndex = cart.items.findIndex(
            item => item.itemId.toString() === itemId
        );

        const sanitizedCustomizations = customizations.map(customization => ({
            fieldName: customization.fieldName,
            options: customization.option ? {
                name: customization.option.name,
                price: customization.option.price
            } : null
        }));

        if (quantity === 0) {
            if (existingItemIndex > -1) cart.items.splice(existingItemIndex, 1);
        } else if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity = quantity;
            cart.items[existingItemIndex].customizations = sanitizedCustomizations;
            console.log(cart.items[existingItemIndex].customizations,sanitizedCustomizations);
        } else {
            cart.items.push({ itemId, quantity, customizations: sanitizedCustomizations });
        }

        // Delete empty cart
        if (cart.items.length === 0) {
            await Cart.findByIdAndDelete(cart._id);
            return res.status(200).json({ message: "Cart cleared", totalItems: 0 });
        }

        // Save and populate in a single step
        const updatedCart = await cart.save().then(c => 
            c.populate('items.itemId')
        );


        const totalItems = updatedCart.items.reduce((sum, item) => sum + item.quantity, 0);
        const currentItem = updatedCart.items.find(item => item.itemId._id.toString() === itemId);

        res.status(200).json({
            message: "Cart updated successfully",
            cart: updatedCart,
            totalItems,
            itemQuantity: currentItem ? currentItem.quantity : 0
        });

    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getCart = async (req, res) => {
    try {
        const token = req.cookies.user_token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const userId = getUserId(token, process.env.JWT_SECRET);
        const cart = await Cart.findOne({ userId })
            .populate('restaurantId')
            .populate('items.itemId');

        if (!cart) {
            return res.status(200).json({
                items: [],
                totalItems: 0,
                totalAmount: 0,
            });
        }

        // Calculate totals and format response
        const formattedItems = cart.items.map(item => {
            const itemBasePrice = item.itemId.price;
            const totalPrice = calculateTotalPrice(itemBasePrice, item.customizations) * item.quantity;

            return {
                _id: item._id,
                itemId: item.itemId._id,
                name: item.itemId.name,
                price: itemBasePrice,
                customizations: item.customizations,
                quantity: item.quantity,
                totalPrice
            };
        });

        const totalItems = formattedItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalAmount = formattedItems.reduce((sum, item) => sum + item.totalPrice, 0);

        const response = {
            _id: cart._id,
            userId: cart.userId,
            restaurant: {
                _id: cart.restaurantId._id,
                name: cart.restaurantId.name,
                description: cart.restaurantId.description,
                address: cart.restaurantId.address,
                image: cart.restaurantId.image,
                phone: cart.restaurantId.phone,
                openingTime: cart.restaurantId.openingTime,
                closingTime: cart.restaurantId.closingTime,
                location: cart.restaurantId.location,
            },
            items: formattedItems,
            totalItems,
            totalAmount,
        };

        res.status(200).json(response);
    } catch (error) {
        console.error("Error getting cart:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.removeItemFromCart = async (req, res) => {
    try {
        const { cartId, itemId } = req.params;
        const cart = await Cart.findById(cartId);
        if (!cart) return res.status(404).json({ message: "Cart not found" });
        cart.items = cart.items.filter(item => item.itemId.toString() !== itemId);
        if (cart.items.length === 0) {
            await Cart.findByIdAndDelete(cart._id);  // Delete the cart if no items left
            return res.status(200).json({ message: "Cart cleared", totalItems: 0 });
        }
        await cart.save();
        res.status(200).json({ message: "Item removed successfully" });
    } catch (error) {
        console.error("Error removing item from cart:", error);
        res.status(500).json({ message: "Server error" });
    }
};