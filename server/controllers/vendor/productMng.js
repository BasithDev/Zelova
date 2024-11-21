const FoodItem = require('../../models/fooditem');
const getRestaurantId = require('../../helpers/getRestaurantId');
exports.addProduct = async (req, res) => {
    try {
        const token = req.cookies.user_token
        const {
            itemName,
            price,
            description,
            category,
            image,
            offer,
            isCustomizable,
        } = req.body;

        const customFieldsChanged = req.body.customFields.map(field => ({
            fieldName: field.fieldName,
            options: field.options.split(',').map((name, index) => ({
                name: name.trim(),
                price: Number(field.price.split(',')[index])
            }))
        }));


        const restaurantId = getRestaurantId(token, process.env.JWT_SECRET);
        if (!restaurantId || !itemName || !price || !category) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: restaurantId, name, price, or foodCategory."
            });
        }

        const existingFoodItem = await FoodItem.findOne({
            restaurantId,
            name: itemName,
            foodCategory: category
        });

        if (existingFoodItem) {
            return res.status(400).json({
                success: false,
                message: "This food item already exists in your menu for the selected category."
            });
        }

        const newFoodItem = new FoodItem({
            restaurantId,
            name: itemName,
            price,
            description,
            foodCategory: category,
            image: image,
            isActive: true,
            offers: offer || null,
            customizable: isCustomizable,
            customizations: customFieldsChanged ? customFieldsChanged : []
        });
        await newFoodItem.save();

        res.status(201).json({
            success: true,
            message: "Food item added successfully.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error. Unable to add food item.",
            error: error.message
        });
    }
};
exports.getProducts = async (req, res) => {
    try {
        const token = req.cookies.user_token;
        const restaurantId = getRestaurantId(token, process.env.JWT_SECRET);
        if (!restaurantId) {
            return res.status(400).json({
                success: false,
                message: "Invalid or missing restaurant ID.",
            });
        }

        const foodItems = await FoodItem.find({ restaurantId })
            .sort({ createdAt: -1 })
            .select('-__v')
            .populate({
                path: 'foodCategory',
                select: 'name description',
            })
            .populate({
                path: 'offers',
                select: 'offerName discountAmount requiredQuantity',
            })
            .populate({
                path: 'customizations.options',
                select: 'name price',
            });

        if (!foodItems.length) {
            return res.status(404).json({
                success: false,
                message: "No food items found.",
            });
        }
        res.status(200).json({
            success: true,
            message: "Food items retrieved successfully.",
            data: foodItems,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error. Unable to fetch food items.",
            error: error.message,
        });
    }
};
exports.listOrUnlist = async (req, res) => {
    const { id } = req.params;
    const { isActive } = req.body;
    try {
        const updatedFoodItem = await FoodItem.findByIdAndUpdate(
            id,
            { isActive },
            { new: true }
        );

        if (!updatedFoodItem) {
            return res.status(404).json({ message: 'Food item not found' });
        }

        res.status(200).json({
            message: `Food item has been ${isActive ? 'listed' : 'unlisted'} successfully.`,
            data: updatedFoodItem,
        });
    } catch (error) {
        console.error('Error updating food item:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await FoodItem.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });

    } catch (error) {
        console.error("Error deleting product:", error)

        return res.status(500).json({
            success: false,
            message: "Failed to delete product. Please try again.",
        });

    }
}

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description, customizable, customizations } = req.body;

        const update = {};
        if (name || price || description || typeof customizable !== "undefined") {
            Object.assign(update, { name, price, description, customizable });

            if (typeof customizable !== "undefined") {
                update.customizations = customizable ? customizations || [] : [];
            }
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { $set: update },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({
            message: "Product updated successfully",
        });
        
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({
            message: "Failed to update product",
            error: error.message,
        });
    }
}