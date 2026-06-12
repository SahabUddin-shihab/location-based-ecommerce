const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true, 
        trim: true 
    },
    subtitle: { 
        type: String, 
        trim: true 
    },
    image: { 
        type: String, 
        required: true 
    },
    mobileImage: String,
    link: String,
    buttonText: String,
    position: {
        type: String,
        enum: ['hero', 'sidebar', 'mid_page', 'footer', 'popup'],
        default: 'hero'
    },
    order: { 
        type: Number, 
        default: 0 
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
    startDate: Date,
    endDate: Date,
    clickCount: { 
        type: Number, 
        default: 0 
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Admin' 
    },
}, { timestamps: true });

bannerSchema.index({ position: 1, isActive: 1, order: 1 });

module.exports = mongoose.model('Banner', bannerSchema);
