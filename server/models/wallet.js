const mongoose = require('mongoose');
const { Schema } = mongoose;

const walletSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  balance: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Wallet", walletSchema);
