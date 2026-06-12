// seeders/seeds/02_cities.seed.js
const City = require('../../models/city.model');

const name = '02 Cities';

const cities = [
    { name: 'Dhaka',       status: true },
    { name: 'Chittagong',  status: true },
    { name: 'Sylhet',      status: true },
    { name: 'Rajshahi',    status: true },
    { name: 'Khulna',      status: true },
    { name: 'Barishal',    status: true },
    { name: 'Mymensingh',  status: true },
    { name: 'Rangpur',     status: true },
    { name: 'Comilla',     status: true },
    { name: 'Narayanganj', status: true },
];

async function up() {
    for (const data of cities) {
        const exists = await City.findOne({ name: data.name });
        if (!exists) {
            await City.create(data);
        }
    }
}

async function down() {
    await City.deleteMany({ name: { $in: cities.map(c => c.name) } });
}

module.exports = { name, up, down };
