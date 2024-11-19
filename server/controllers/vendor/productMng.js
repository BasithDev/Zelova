const FoodItem = require('../../models/fooditem');
const getRestaurantId = require('../../helpers/getRestaurantId')
exports.addProduct = async (req, res) => {
    try {
        const token = req.cookies.user_token
        const {
            name,
            price,
            description,
            foodCategory,
            images,
            offers,
            customizable,
            customizations
        } = req.body;
        
        const restaurantId = getRestaurantId(token, process.env.JWT_SECRET);
        if (!restaurantId || !name || !price || !foodCategory) {
            return res.status(400).json({ 
                success: false, 
                message: "Missing required fields: restaurantId, name, price, or foodCategory." 
            });
        }

        const newFoodItem = new FoodItem({
            restaurantId,
            name,
            price,
            description,
            foodCategory,
            images,
            isActive,
            offers: offers || null,
            customizable,
            customizations: customizable ? customizations : []
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