const FoodItem = require('../../models/foodItem');
const getRestaurantId = require('../../helpers/restaurantIdHelper');
const statusCodes = require('../../config/statusCodes');

const addProduct = async (req, res, next) => {
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
            return res.status(statusCodes.BAD_REQUEST).json({
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
            return res.status(statusCodes.BAD_REQUEST).json({
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

        res.status(statusCodes.CREATED).json({
            success: true,
            message: "Food item added successfully.",
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};
const getProducts = async (req, res, next) => {
    try {
        const token = req.cookies.user_token;
        const restaurantId = getRestaurantId(token, process.env.JWT_SECRET);
        if (!restaurantId) {
            return res.status(statusCodes.BAD_REQUEST).json({
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
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "No food items found.",
            });
        }
        res.status(statusCodes.OK).json({
            success: true,
            message: "Food items retrieved successfully.",
            data: foodItems,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};
const listOrUnlist = async (req, res, next) => {
    const { id } = req.params;
    const { isActive } = req.body;
    try {
        const updatedFoodItem = await FoodItem.findByIdAndUpdate(
            id,
            { isActive },
            { new: true }
        );

        if (!updatedFoodItem) {
            return res.status(statusCodes.NOT_FOUND).json({ message: 'Food item not found' });
        }

        res.status(statusCodes.OK).json({
            message: `Food item has been ${isActive ? 'listed' : 'unlisted'} successfully.`,
            data: updatedFoodItem,
        });
    } catch (error) {
        console.error('Error updating food item:', error);
        next(error);
    }
}

const deleteProduct = async (req, res, next) => {
    const { id } = req.params;
    try {
        const product = await FoodItem.findByIdAndDelete(id);

        if (!product) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Product not found",
            });
        }

        return res.status(statusCodes.OK).json({
            success: true,
            message: "Product deleted successfully",
        });

    } catch (error) {
        console.error("Error deleting product:", error)
        next(error);
    }
}

const updateProduct = async (req, res, next) => {
    try {
        const { id, name, price, description, image } = req.body;

        const update = {};
        if (id || name || price || description || image) {
            Object.assign(update, { name, price, description, image });
        }

        const updatedProduct = await FoodItem.findByIdAndUpdate(
            id,
            { $set: update },
            { new: true, runValidators: true }
        )
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

        if (!updatedProduct) {
            return res.status(statusCodes.NOT_FOUND).json({ message: "Product not found" });
        }

        res.status(statusCodes.OK).json({
            message: "Product updated successfully",
            updatedProduct
        });

    } catch (error) {
        console.error("Error updating product:", error);
        next(error);
    }
}
const updateOffer = async (req, res, next) => {
    try {
      const { productId, offerId } = req.body;
  
      if (!productId) {
        return res.status(statusCodes.BAD_REQUEST).json({ message: 'FoodItem ID is required.' });
      }
  
      const foodItem = await FoodItem.findById(productId);
      if (!foodItem) {
        return res.status(statusCodes.NOT_FOUND).json({ message: 'FoodItem not found.' });
      }

      if(offerId){
        foodItem.offers = offerId;
      }else{
        foodItem.offers = null
      }
      await foodItem.save();
  
      return res.status(statusCodes.OK).json({
        message: 'Offer updated successfully.',
        updatedOffer: offerId,
      });
    } catch (error) {
      console.error('Error updating offer:', error);
      next(error);
    }
  };

  module.exports = {
    addProduct,
    getProducts,
    listOrUnlist,
    deleteProduct,
    updateProduct,
    updateOffer
  }