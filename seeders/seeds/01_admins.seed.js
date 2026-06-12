
const Admin = require('../../models/admin.model');

const name = '01 Admins';

const admins = [
    {
        name:     'Super Admin',
        email:    'superadmin@shop.com',
        phone:    '01700000001',
        password: 'SuperAdmin@123',
        role:     'super_admin',
        isActive: true,
    },
    {
        name:     'Shop Admin',
        email:    'admin@shop.com',
        phone:    '01700000002',
        password: 'Admin@123456',
        role:     'admin',
        isActive: true,
    },
    {
        name:     'Moderator',
        email:    'moderator@shop.com',
        phone:    '01700000003',
        password: 'Mod@1234567',
        role:     'moderator',
        isActive: true,
    },
];


async function up() {
    for (const data of admins) {
        const exists = await Admin.findOne({ email: data.email });
        if (!exists) {
            await Admin.create(data);
        }
    }
}

async function down() {
    await Admin.deleteMany({ email: { $in: admins.map(a => a.email) } });
}

module.exports = { name, up, down };
