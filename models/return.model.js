const mongoose = require('mongoose');

const returnRequestSchema = new mongoose.Schema({
    order: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Order', 
        required: true 
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    items: [{
        orderItem: mongoose.Schema.Types.ObjectId,
        product: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product' 
        },
        quantity: { 
            type: Number, min: 1 
        },
        reason: String,
    }],
    reason: { 
        type: String, 
        required: true 
    },
    description: String,
    images: [String],
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'refunded'],
        default: 'pending'
    },
    refundAmount: { 
        type: Number, 
        default: 0 
    },
    adminNote: String,
    processedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Admin' 
    },
    processedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('ReturnRequest', returnRequestSchema);
