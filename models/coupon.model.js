const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Coupon code required'],
        unique: true,
        uppercase: true,
        trim: true,
        maxLength: 20
    },
    description: { 
        type: String, 
        trim: true 
    },
    discountType: {
        type: String,
        enum: ['flat', 'percent'],
        required: true
    },
    discountValue: { 
        type: Number, 
        required: true, 
        min: 0 
    },
    maxDiscount: { 
        type: Number, 
        default: null 
    },      
    minOrderAmount: { 
        type: Number, 
        default: 0 
    },
    maxUsage: { 
        type: Number, 
        default: null 
    }, 
    maxUsagePerUser: { 
        type: Number, 
        default: 1 
    },
    usedCount: { 
        type: Number, 
        default: 0 
    },
    usedBy: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    applicableCategories: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category' 
    }],
    applicableProducts: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product' 
    }],
    startDate: { 
        type: Date, 
        default: Date.now 
    },
    endDate: { 
        type: Date, 
        required: true 
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Admin' 
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1, endDate: 1 });

couponSchema.virtual('isValid').get(function () {
    const now = new Date();
    return this.isActive &&
        this.startDate <= now &&
        this.endDate >= now &&
        (this.maxUsage === null || this.usedCount < this.maxUsage);
});

module.exports = mongoose.model('Coupon', couponSchema);
