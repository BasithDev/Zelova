const mongoose = require('mongoose');
const { Schema } = mongoose;
const adminSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Admin", adminSchema);
