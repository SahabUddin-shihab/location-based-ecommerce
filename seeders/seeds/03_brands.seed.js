// seeders/seeds/03_brands.seed.js
const Brand = require('../../models/brand.model');

const name = '03 Brands';

const brands = [
    { name: 'Apple',     status: true },
    { name: 'Samsung',   status: true },
    { name: 'Sony',      status: true },
    { name: 'LG',        status: true },
    { name: 'Nike',      status: true },
    { name: 'Adidas',    status: true },
    { name: 'Puma',      status: true },
    { name: 'Dell',      status: true },
    { name: 'HP',        status: true },
    { name: 'Lenovo',    status: true },
    { name: 'Xiaomi',    status: true },
    { name: 'OnePlus',   status: true },
    { name: 'Realme',    status: true },
    { name: 'Walton',    status: true },
    { name: 'Symphony',  status: true },
];

async function up() {
    for (const data of brands) {
        const exists = await Brand.findOne({ name: data.name });
        if (!exists) {
            await Brand.create(data);
        }
    }
}

async function down() {
    await Brand.deleteMany({ name: { $in: brands.map(b => b.name) } });
}

module.exports = { name, up, down };
