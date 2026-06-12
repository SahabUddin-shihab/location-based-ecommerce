// seeders/seeds/04_categories.seed.js
const Category = require('../../models/category.model');
const City     = require('../../models/city.model');

const name = '04 Categories';

const categoryData = [
    {
        name:        'Electronics',
        description: 'Phones, laptops, tablets, TVs and all electronic devices',
        image:       'default-category.jpg',
    },
    {
        name:        'Fashion & Clothing',
        description: 'Men, women and kids clothing, footwear and accessories',
        image:       'default-category.jpg',
    },
    {
        name:        'Home & Living',
        description: 'Furniture, kitchen appliances, décor and home essentials',
        image:       'default-category.jpg',
    },
    {
        name:        'Sports & Outdoors',
        description: 'Sports gear, fitness equipment and outdoor accessories',
        image:       'default-category.jpg',
    },
    {
        name:        'Books & Stationery',
        description: 'Books, notebooks, pens and all stationery items',
        image:       'default-category.jpg',
    },
    {
        name:        'Health & Beauty',
        description: 'Skincare, haircare, health supplements and personal care',
        image:       'default-category.jpg',
    },
    {
        name:        'Groceries & Food',
        description: 'Fresh produce, packaged food and daily essentials',
        image:       'default-category.jpg',
    },
    {
        name:        'Toys & Games',
        description: 'Toys, board games and entertainment for all ages',
        image:       'default-category.jpg',
    },
];

async function up() {
    // Use the first available city as the required FK
    const city = await City.findOne({ status: true });
    if (!city) throw new Error('No cities found — run 02_cities.seed first');

    for (const data of categoryData) {
        const exists = await Category.findOne({ name: data.name });
        if (!exists) {
            await Category.create({ ...data, city: city._id });
        }
    }
}

async function down() {
    await Category.deleteMany({ name: { $in: categoryData.map(c => c.name) } });
}

module.exports = { name, up, down };
