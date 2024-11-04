const mongoose = require('mongoose');
const { Schema } = mongoose;

const favoriteSchema = new Schema({
  items: [{
    type: Schema.Types.ObjectId,
    ref: 'FoodItem',
  }],
  restaurants: [{
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
  }],
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Favorites", favoriteSchema);
