const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    offerName: {
        type: String,
        required: true,
        trim: true,
    },
    requiredQuantity: {
        type: Number,
        required: true,
        min: 1,
    },
    discountAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant', 
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Offer', offerSchema);
