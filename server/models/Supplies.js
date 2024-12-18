const mongoose = require('mongoose');
const { Schema } = mongoose;
const SuppliesSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  heading:{
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  contactNumber: {
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
}, {
  timestamps: true,
});

// Ensure 2dsphere index on location field for geospatial queries
SuppliesSchema.index({ location: '2dsphere' });

module.exports = mongoose.model("Supply", SuppliesSchema);