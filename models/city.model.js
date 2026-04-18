const mongoose= require('mongoose');
const slugify= require('slugify');
const { email } = require('zod');



const citySchema= new mongoose.Schema({
    name: {
        required: [true, 'Name is required'],
        type: String,
        unique: true,
        trim: true
    },
    slug: String
});

citySchema.pre('save', function(next){
    this.slug= slugify(this.name,{ lower: true });
    next();
});

module.exports= mongoose.model("CityModel",citySchema);