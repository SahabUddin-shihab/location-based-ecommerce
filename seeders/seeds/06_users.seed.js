// seeders/seeds/06_users.seed.js
const User = require('../../models/user.model');

const name = '06 Users';

const users = [
    {
        name:            'Rahim Uddin',
        email:           'rahim@example.com',
        phone:           '01711111111',
        password:        'User@123456',
        isEmailVerified: true,
        isActive:        true,
        addresses: [{
            label:        'home',
            name:         'Rahim Uddin',
            phone:        '01711111111',
            addressLine1: 'House 12, Road 5, Dhanmondi',
            city:         'Dhaka',
            country:      'Bangladesh',
            isDefault:    true,
        }],
    },
    {
        name:            'Karim Hossain',
        email:           'karim@example.com',
        phone:           '01722222222',
        password:        'User@123456',
        isEmailVerified: true,
        isActive:        true,
        addresses: [{
            label:        'home',
            name:         'Karim Hossain',
            phone:        '01722222222',
            addressLine1: 'Flat 3A, Agrabad',
            city:         'Chittagong',
            country:      'Bangladesh',
            isDefault:    true,
        }],
    },
    {
        name:            'Sumaiya Begum',
        email:           'sumaiya@example.com',
        phone:           '01733333333',
        password:        'User@123456',
        isEmailVerified: true,
        isActive:        true,
        addresses: [{
            label:        'home',
            name:         'Sumaiya Begum',
            phone:        '01733333333',
            addressLine1: 'Mirpur-10, Section 11',
            city:         'Dhaka',
            country:      'Bangladesh',
            isDefault:    true,
        }],
    },
    {
        name:            'Test User',
        email:           'testuser@example.com',
        phone:           '01744444444',
        password:        'Test@123456',
        isEmailVerified: true,
        isActive:        true,
    },
    // Inactive user for testing
    {
        name:            'Inactive User',
        email:           'inactive@example.com',
        phone:           '01755555555',
        password:        'Test@123456',
        isEmailVerified: false,
        isActive:        false,
    },
];

async function up() {
    for (const data of users) {
        const exists = await User.findOne({ email: data.email });
        if (!exists) {
            await User.create(data);
        }
    }
}

async function down() {
    await User.deleteMany({ email: { $in: users.map(u => u.email) } });
}

module.exports = { name, up, down };
