const mongoose = require('mongoose');
const { Schema } = mongoose;
const cartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [{
    itemId: {
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
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    customizations: [{
      fieldName: String,
      options: [{
        name: String,
        price: Number
      }]
    }],
    offer: {
      type: Schema.Types.ObjectId,
      ref: 'Offer'
    }
  }],
  deliveryType: {
    type: String,
  },
  couponCode: {
    type: String,
    trim: true,
  },
  suggestions: {
    type: String
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model("Cart", cartSchema);