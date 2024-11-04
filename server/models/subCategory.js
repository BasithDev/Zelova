const mongoose = require('mongoose');
const { Schema } = mongoose;

const subCategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  item: {
    type: Schema.Types.ObjectId,
    ref: 'FoodItem',
    default: null,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("SubCategory", subCategorySchema);
