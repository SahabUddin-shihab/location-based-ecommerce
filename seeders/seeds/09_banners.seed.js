// seeders/seeds/09_banners.seed.js
const Banner = require('../../models/banner.model');

const name = '09 Banners';

const banners = [
    {
        title:      'Mega Sale — Up to 50% Off!',
        subtitle:   'Shop the biggest sale of the year on electronics',
        image:      '/uploads/banners/hero-1.jpg',
        link:       '/products?category=electronics',
        buttonText: 'Shop Now',
        position:   'hero',
        order:      1,
        isActive:   true,
    },
    {
        title:      'New Arrivals — Fashion 2025',
        subtitle:   'Explore the latest trends in fashion and clothing',
        image:      '/uploads/banners/hero-2.jpg',
        link:       '/products?category=fashion',
        buttonText: 'Explore Now',
        position:   'hero',
        order:      2,
        isActive:   true,
    },
    {
        title:      'Free Shipping on Orders Over ৳1000',
        subtitle:   'Limited time offer — order today!',
        image:      '/uploads/banners/hero-3.jpg',
        link:       '/products',
        buttonText: 'Order Now',
        position:   'hero',
        order:      3,
        isActive:   true,
    },
    {
        title:      'Flash Deal — Samsung S24',
        subtitle:   'Limited stock available',
        image:      '/uploads/banners/sidebar-1.jpg',
        link:       '/products?keyword=samsung',
        buttonText: 'Grab It',
        position:   'sidebar',
        order:      1,
        isActive:   true,
    },
    {
        title:      'Nike Footwear Sale',
        subtitle:   '30% off all Nike shoes this weekend',
        image:      '/uploads/banners/mid-1.jpg',
        link:       '/products?brand=nike',
        buttonText: 'Shop Shoes',
        position:   'mid_page',
        order:      1,
        isActive:   true,
    },
];

async function up() {
    for (const data of banners) {
        const exists = await Banner.findOne({ title: data.title });
        if (!exists) {
            await Banner.create(data);
        }
    }
}

async function down() {
    await Banner.deleteMany({ title: { $in: banners.map(b => b.title) } });
}

module.exports = { name, up, down };
