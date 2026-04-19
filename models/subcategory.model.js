const mongoose= require('mongoose');

const subcategorySchema= new mongoose.Schema({
    
    name: {
        type: String,
        required: [true, 'Name is required'],
        minLength: [3, 'Name must be greater then 3 character'],
        maxLength: [30, 'Name must be less then 30 characters'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    status: {
        type: Boolean,
        default: 1
    },
    image: {
        type: String,
        default: 'default-subcategory.jpg'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category'
    }
},{
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}
);

module.exports= mongoose.model('Subcategory',subcategorySchema);