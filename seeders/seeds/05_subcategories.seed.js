// seeders/seeds/05_subcategories.seed.js
const Subcategory = require('../../models/subcategory.model');
const Category    = require('../../models/category.model');

const name = '05 Subcategories';

// Map of category name → subcategories
const subcategoryMap = {
    'Electronics': [
        'Mobile Phones', 'Laptops & Computers', 'Tablets',
        'Televisions', 'Cameras', 'Audio & Headphones',
        'Accessories & Cables', 'Smart Watches',
    ],
    'Fashion & Clothing': [
        "Men's Clothing", "Women's Clothing", "Kids' Clothing",
        'Footwear', 'Bags & Luggage', 'Watches & Jewellery',
    ],
    'Home & Living': [
        'Furniture', 'Kitchen Appliances', 'Bedding',
        'Home Décor', 'Cleaning Supplies', 'Lighting',
    ],
    'Sports & Outdoors': [
        'Gym & Fitness', 'Cricket', 'Football',
        'Cycling', 'Swimming', 'Outdoor & Camping',
    ],
    'Health & Beauty': [
        'Skincare', 'Haircare', 'Health Supplements',
        'Personal Care', 'Fragrances',
    ],
    'Groceries & Food': [
        'Fresh Vegetables', 'Fruits', 'Dairy & Eggs',
        'Rice & Grains', 'Packaged Foods', 'Beverages',
    ],
};

async function up() {
    for (const [categoryName, subcategories] of Object.entries(subcategoryMap)) {
        const category = await Category.findOne({ name: categoryName });
        if (!category) continue;  // category not seeded yet; skip gracefully

        for (const subName of subcategories) {
            const exists = await Subcategory.findOne({ name: subName });
            if (!exists) {
                await Subcategory.create({
                    name:     subName,
                    category: category._id,
                    status:   true,
                });
            }
        }
    }
}

async function down() {
    const allNames = Object.values(subcategoryMap).flat();
    await Subcategory.deleteMany({ name: { $in: allNames } });
}

module.exports = { name, up, down };
