const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
    },
    variant: {
        name: String,
        value: String,
    },
    quantity: { 
        type: Number, 
        required: 
        true, min: 1, 
        default: 1 
    },
    price: { 
        type: Number, 
        required: true 
    },      
    salePrice: { 
        type: Number, 
        default: null 
    },
}, { _id: true, timestamps: true });

const cartSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        unique: true, 
        sparse: true 
    },
    sessionId: { 
        type: String, 
        unique: true, 
        sparse: true 
    }, 
    items: [cartItemSchema],
    coupon: {
        code: String,
        discountType: { 
            type: String, enum: ['flat', 'percent'] 
        },
        discountValue: Number,
        discountAmount: { 
            type: Number, 
            default: 0 
        },
    },
    expiresAt: Date,
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

cartSchema.virtual('subtotal').get(function () {
    return this.items.reduce((sum, item) => {
        const unitPrice = item.salePrice ?? item.price;
        return sum + unitPrice * item.quantity;
    }, 0);
});

cartSchema.virtual('itemCount').get(function () {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

module.exports = mongoose.model('Cart', cartSchema);
