const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', required: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    thumbnail: String,
    sku: String,
    variant: { 
        name: String, 
        value: String, 
    },
    quantity: { 
        type: Number, 
        required: true, 
        min: 1 
    },
    price: { 
        type: Number, 
        required: true 
    },
    totalPrice: { 
        type: Number, 
        required: true 
    },
}, { _id: true });

const shippingAddressSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    phone: { 
        type: String, 
        required: true 
    },
    addressLine1: { 
        type: String, 
        required: true 
    },
    addressLine2: String,
    city: { 
        type: String, 
        required: true 
    },
    state: String,
    postalCode: String,
    country: { 
        type: String, 
        default: 'Bangladesh' 
    },
}, { _id: false });

const statusHistorySchema = new mongoose.Schema({
    status: String,
    note: String,
    changedBy: { 
        type: mongoose.Schema.Types.ObjectId 
    },
    changedByRole: { 
        type: String, enum: ['user', 'admin'] 
    },
    changedAt: { 
        type: Date, default: Date.now 
    },
}, { _id: false });

const orderSchema = new mongoose.Schema({
    orderNumber: { 
        type: String, 
        unique: true 
    },

    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },   
    guestEmail: String,
    guestPhone: String,

    items: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    billingAddress: shippingAddressSchema,


    subtotal: { 
        type: Number, 
        required: true 
    },
    shippingCharge: { 
        type: Number, 
        default: 0 
    },
    discount: { 
        type: Number, 
        default: 0 
    },
    tax: { 
        type: Number, 
        default: 0 
    },
    total: { 
        type: Number, 
        required: true 
    },


    coupon: {
        code: String,
        discountType: String,
        discountValue: Number,
        discountAmount: Number,
    },

    status: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'return_requested', 'returned'],
        default: 'pending'
    },
    statusHistory: [statusHistorySchema],
    cancelReason: String,
    returnReason: String,

    paymentMethod: {
        type: String,
        enum: ['cod', 'stripe', 'paypal', 'sslcommerz', 'bkash', 'nagad'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
        default: 'pending'
    },
    paymentDetails: mongoose.Schema.Types.Mixed,
    paidAt: Date,

    trackingNumber: String,
    carrier: String,
    estimatedDelivery: Date,
    deliveredAt: Date,

    invoiceNumber: String,
    invoiceGeneratedAt: Date,

    notes: String, 
    adminNotes: String,
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });

orderSchema.pre('save', function (next) {
    if (!this.orderNumber) {
        const ts = Date.now().toString(36).toUpperCase();
        const rand = Math.random().toString(36).substr(2, 4).toUpperCase();
        this.orderNumber = `ORD-${ts}-${rand}`;
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);
