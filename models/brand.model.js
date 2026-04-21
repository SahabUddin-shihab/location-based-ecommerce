const mongoose = require('mongoose');
const slugify = require('slugify');

const brandSchema = new mongoose.Schema({
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
},{
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

brandSchema.pre('save', function() {
    this.slug = slugify(this.name, { lower: true });
});


module.exports = mongoose.model('Brand', brandSchema);