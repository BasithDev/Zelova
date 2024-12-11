const mongoose = require('mongoose');
const { Schema } = mongoose;

const customizationSchema = new Schema({
  fieldName: {
    type: String,
    required: true,
    trim: true,
  },
  options: [
    {
      name: { type: String, required: true, trim: true },
      price: { type: Number, required: true, min: 0 },
    },
  ],
});

const foodItemsSchema = new Schema({
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    trim: true,
  },
  foodCategory: {
    type: Schema.Types.ObjectId,
    ref: 'SubCategory',
    required: true,
  },
  image: {
      type: String,
    },
  isActive: {
    type: Boolean,
    default: true,
  },
  offers: {
    type: Schema.Types.ObjectId,
    ref: 'Offer',
  },
  customizable: {
    type: Boolean,
    default: false,
  },
  customizations: [customizationSchema],
}, {
  timestamps: true,
});

module.exports = mongoose.models.FoodItem || mongoose.model("FoodItem", foodItemsSchema);