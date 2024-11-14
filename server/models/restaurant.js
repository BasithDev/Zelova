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
      required: true,
      index: "2dsphere",
    },
  },
  image: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  license: {
    type: String,
    required: true,
    trim: true,
  },
  openingTime: {
    type: String,
    required: true,
    trim: true,
  },
  closingTime: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Restaurant", restaurantSchema);