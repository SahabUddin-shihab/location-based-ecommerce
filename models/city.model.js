const mongoose = require('mongoose');
const slugify = require('slugify');

const citySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: true,
        trim: true
    },
    slug: String,
    status: {
        type: Boolean,
        default: true
    }
});

citySchema.pre('save', function() {
    this.slug = slugify(this.name, { lower: true });
});

module.exports = mongoose.model('CityModel', citySchema);