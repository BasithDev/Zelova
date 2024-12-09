const mongoose = require('mongoose');
const { Schema } = mongoose;

const zcoinSchema = new Schema({
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
  lastSentUserIds: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }]
}, {
  timestamps: true,
});

module.exports = mongoose.model("zcoin", zcoinSchema);
