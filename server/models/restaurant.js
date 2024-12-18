const mongoose = require('mongoose');
const { Schema } = mongoose;
const restaurantSchema = new Schema({
  vendorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
    },
  },
  address:{
    type: String,
  },
  image: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  openingTime: {
    type: String,
    trim: true,
  },
  closingTime: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  totalRatingCount: {
    type: Number,
    default: 0,
  },
  totalRatings: {
    type: Number,
    default: 0,
  },
  avgRating: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Restaurant", restaurantSchema);