const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  items: [{
    item: {
      type: Schema.Types.ObjectId,
      ref: 'FoodItem',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    itemPrice: {
      type: Number,
      required: true,
    },
    selectedCustomizations: [{
      fieldName: String,
      options: {
        name: String,
        price: Number
      }
    }],
  }],
  totalItems: { 
    type: Number,
    default: 0,
  },
  totalPrice: { 
    type: Number,
    default: 0,
  }
}, {
  timestamps: true
});

// Pre-validate middleware to handle restaurantId
cartSchema.pre('validate', async function(next) {
  try {
    if (this.items && this.items.length > 0) {
      const FoodItem = mongoose.model('FoodItem');
      
      const firstFoodItem = await FoodItem.findById(this.items[0].item);
      if (!firstFoodItem) {
        throw new Error('Food item not found');
      }

      if (!this.restaurantId) {
        this.restaurantId = firstFoodItem.restaurantId;
      } else {
        for (const cartItem of this.items) {
          const foodItem = await FoodItem.findById(cartItem.item);
          if (!foodItem) {
            throw new Error('Food item not found');
          }
          if (foodItem.restaurantId.toString() !== this.restaurantId.toString()) {
            throw new Error('Cannot add items from different restaurant. Please clear cart first.');
          }
        }
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to calculate prices and totals
cartSchema.pre('save', async function(next) {
  try {
    if (this.items && this.items.length > 0) {
      const FoodItem = mongoose.model('FoodItem');

      for (const item of this.items) {
        const foodItem = await FoodItem.findById(item.item);
        if (!foodItem) {
          throw new Error('Food item not found');
        }

        item.itemPrice = foodItem.price;

        if (item.selectedCustomizations && item.selectedCustomizations.length > 0) {
          const customizationPrice = item.selectedCustomizations.reduce((total, cust) => 
            total + (cust.options.price || 0), 0);
          item.itemPrice += customizationPrice;
        }
      }
    }

    this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
    this.totalPrice = this.items.reduce((total, item) => 
      total + (item.itemPrice * item.quantity), 0);

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Cart", cartSchema);