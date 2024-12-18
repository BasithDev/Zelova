const mongoose = require('mongoose');
const { Schema } = mongoose;

const favoriteSchema = new Schema({
  item: {
    type: Schema.Types.ObjectId,
    ref: 'FoodItem',
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Favorites", favoriteSchema);
