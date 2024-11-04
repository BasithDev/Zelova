const mongoose = require('mongoose');
const { Schema } = mongoose;
const couponSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  },
  value: {
    type: Number,
    required: true,
    min: 0,
  },
  type: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Coupon", couponSchema);