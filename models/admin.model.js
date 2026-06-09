const mongoose= require('mongoose');

const adminSchema= mongoose.Schema({
    name: {
        required: [true, 'Name is required'],
        minLength: [3, 'Name of the character will be greater then 3'],
        maxLength: [30, 'Characters of the name les then 30 characters'],
        trim: true
    },
    user_name: String,
    email: {
        required:[true, 'Email is required'],
        unique: true,
        trim: true
    },
    phone: {
        required: [true,'Phone number is required'],
        trim: true
    },
    role: {
        required: [true, 'Role is required'],
        enum: ['super_admin','admin','moderator','influencer'],
        default: 'admin'
    }
});

adminSchema.pre('save', function(){
    
});

module.exports= mongoose.model('Admin',adminSchema);