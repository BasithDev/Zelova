const mongoose = require('mongoose');
const { Schema } = mongoose;
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
  offerPrice: {
    type: Number,
    min: 0
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  images: [{
    type: String,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  offerType: {
    type: String,
    enum: ["percentage", "flat"],
  },
}, {
  timestamps: true,
});
module.exports = mongoose.model("FoodItem", foodItemsSchema);