const mongoose = require('mongoose');
const { Schema } = mongoose;

const subCategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  categoryName: {
    type: String,
    required: true,
    ref: 'Category',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("SubCategory", subCategorySchema);
