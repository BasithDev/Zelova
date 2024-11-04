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
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  license: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("VendorRequest", vendorRequestSchema);