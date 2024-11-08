const mongoose = require('mongoose');
const { Schema } = mongoose;
const vendorRequestSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  restaurantName: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  license: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("VendorRequest", vendorRequestSchema);