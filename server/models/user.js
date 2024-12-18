const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /\S+@\S+\.\S+/,
  },
  password: {
    type: String,
    minlength: 6,
  },
  age: {
    type: Number,
    min: 5,
    max: 120,
  },
  phoneNumber: {
    type: String,
    match: /^\d{10}$/,
  },
  profilePicture: {
    type: String
  },
  zCoins: {
    type: Number,
    default: 0,
  },
  isVendor: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isGoogleID: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    default: "active",
  },
  currentAddress :{
    type: String,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("User", userSchema);