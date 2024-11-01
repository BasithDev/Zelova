const mongoose = require('mongoose');
const { Schema } = mongoose;

const transactionSchema = new Schema({
  orderID: {
    type: String,
    required: true,
    trim: true,
  },
  paymentType: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Transaction", transactionSchema);