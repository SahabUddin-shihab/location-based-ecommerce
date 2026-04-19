const slugify= require('slugify');
const mongoose= require('mongoose');

const categorySchema= new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true,"Name is required. please provide your name!"],
            unique: true,
            trim: true,
            maxLength: [50, 'Category name must me lower then 50 characters']
        },
        slug: String,
        description: {
            type: String,
            required: [true, 'Description is require. please provide a description'],
            maxLength: [500, 'Description leng must not be more then 500 characters']
        },
        image: {
            type: String,
            default: 'default-category.jpg'
        },
        city: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CityModel',
            required: true
        }
    },{
        timestamps: true,
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
    }
)

categorySchema.pre('save', function(){
    this.slug= slugify(this.name, { lower: true });
});

categorySchema.virtual('subcategories',{
    ref: 'Subcategory',
    localField: '_id',
    foreignField: 'category',
    justOne: false
});

module.exports= new mongoose.model('Category',categorySchema);