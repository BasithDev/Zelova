const mongoose = require('mongoose');
const { Schema } = mongoose;

const couponSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
    min: 0
  },
  minPrice: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  expiry: {
    type: Date
  },
}, {
  timestamps: true
});

module.exports = mongoose.model("Coupon", couponSchema);