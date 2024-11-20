const FoodItem = require('../../models/fooditem');
const getRestaurantId = require('../../helpers/getRestaurantId');
const fooditem = require('../../models/fooditem');
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
            name:itemName,
            price,
            description,
            foodCategory:category,
            image:image,
            isActive:true,
            offers: offer || null,
            customizable:isCustomizable,
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