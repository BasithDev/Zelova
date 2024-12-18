const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
    },
    userEmail: {
        type: String,
        required: true,
        trim: true,
    },
    problemOn: {
        type: String,
        required: true,
        trim: true,
    },
    orderId: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    refund:{
        type: Number,
        default: 0,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Issue', issueSchema);