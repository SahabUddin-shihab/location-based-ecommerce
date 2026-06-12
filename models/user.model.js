const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
    label: { 
        type: String, 
        enum: ['home', 'office', 'other'], 
        default: 'home' 
    },
    name: { 
        type: String, 
        required: true, 
        trim: true 
    },
    phone: { 
        type: String, 
        required: true, 
        trim: true 
    },
    addressLine1: { 
        type: String, 
        required: true, 
        trim: true 
    },
    addressLine2: { 
        type: String, 
        trim: true 
    },
    city: { 
        type: String, 
        required: true, 
        trim: true 
    },
    state: { 
        type: String, 
        trim: true 
    },
    postalCode: { 
        type: String, 
        trim: true 
    },
    country: { 
        type: String, 
        required: true, 
        default: 'Bangladesh', 
        trim: true 
    },
    isDefault: { 
        type: Boolean, 
        default: false 
    },
}, { _id: true, timestamps: true });

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxLength: [50, 'Name too long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        trim: true,
        sparse: true
    },
    password: {
        type: String,
        minLength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    avatar: { 
        type: String, 
        default: null 
    },
    role: { 
        type: String, 
        enum: ['user', 'vip'], 
        default: 'user' 
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
    isEmailVerified: { 
        type: Boolean, 
        default: false 
    },
    emailVerificationToken: { 
        type: String, 
        select: false 
    },
    emailVerificationExpires: { 
        type: Date, 
        select: false 
    },
    passwordResetToken: { 
        type: String, 
        select: false 
    },
    passwordResetExpires: { 
        type: Date, 
        select: false 
    },
    addresses: [addressSchema],
    wishlist: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product' 
    }],
    recentlyViewed: [{
        product: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product' 
        },
        viewedAt: { 
            type: Date, 
            default: Date.now 
        }
    }],
    lastLogin: Date,
    refreshToken: { 
        type: String, 
        select: false 
    },

    googleId: { 
        type: String, 
        sparse: true 
    },
    facebookId: { 
        type: String, 
        sparse: true 
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
};


userSchema.methods.addToRecentlyViewed = function (productId) {
    const pid = productId.toString();
    this.recentlyViewed = this.recentlyViewed.filter(
        (r) => r.product.toString() !== pid
    );
    this.recentlyViewed.unshift({ product: productId, viewedAt: new Date() });
    if (this.recentlyViewed.length > 20) {
        this.recentlyViewed = this.recentlyViewed.slice(0, 20);
    }
};

module.exports = mongoose.model('User', userSchema);
