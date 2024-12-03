const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    restaurantId: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    user: {
        name: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        }
    },
    items: [{
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        totalPrice: {
            type: Number,
            required: true,
            min: 0
        },
        customizations: [{
            fieldName: {
                type: String,
                required: true
            },
            selectedOption: {
                type: Schema.Types.Mixed,
                required: true
            }
        }]
    }],
    billDetails: {
        itemTotal: {
            type: Number,
            required: true,
            min: 0
        },
        platformFee: {
            type: Number,
            required: true,
            min: 0
        },
        deliveryFee: {
            type: Number,
            required: true,
            min: 0
        },
        tax: {
            type: Number,
            required: true,
            min: 0
        },
        discount: {
            type: Number,
            default: 0,
            min: 0
        },
        offerSavings: {
            type: Number,
            default: 0,
            min: 0
        },
        totalSavings: {
            type: Number,
            default: 0,
            min: 0
        },
        finalAmount: {
            type: Number,
            required: true,
            min: 0
        },
        paymentMethod: {
            type: String,
            required: true,
            enum: ['COD', 'RAZORPAY', 'ZCOINS']
        }
    },
    status: {
        type: String,
        required: true,
        default: 'PENDING'
    },
    rating: {
        type: Number,
        min: 0,
        max: 5
    },
    usedCoupon: {
        code: {
            type: String,
            ref: 'Coupon',
            trim: true
        }
    }
}, {
    timestamps: true
});

orderSchema.index({ userId: 1, createdAt: -1 });

orderSchema.pre('validate', function (next) {
    if (!this.orderId) {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        this.orderId = `ZEL-${year}${month}${day}-${random}`;
    }
    next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;