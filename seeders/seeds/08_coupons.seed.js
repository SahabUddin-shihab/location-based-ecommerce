// seeders/seeds/08_coupons.seed.js
const Coupon = require('../../models/coupon.model');

const name = '08 Coupons';

const coupons = [
    {
        code:           'WELCOME50',
        description:    'Welcome discount — ৳50 off your first order',
        discountType:   'flat',
        discountValue:  50,
        minOrderAmount: 300,
        maxUsage:       null,       // unlimited
        maxUsagePerUser:1,
        startDate:      new Date(),
        endDate:        new Date('2026-12-31'),
        isActive:       true,
    },
    {
        code:           'SAVE10',
        description:    '10% off on all orders',
        discountType:   'percent',
        discountValue:  10,
        maxDiscount:    500,
        minOrderAmount: 500,
        maxUsage:       1000,
        maxUsagePerUser:2,
        startDate:      new Date(),
        endDate:        new Date('2026-12-31'),
        isActive:       true,
    },
    {
        code:           'FLASH20',
        description:    'Flash sale — 20% off, max ৳1000 discount',
        discountType:   'percent',
        discountValue:  20,
        maxDiscount:    1000,
        minOrderAmount: 1000,
        maxUsage:       500,
        maxUsagePerUser:1,
        startDate:      new Date(),
        endDate:        new Date('2026-12-31'),
        isActive:       true,
    },
    {
        code:           'EID200',
        description:    'Eid special — ৳200 flat discount',
        discountType:   'flat',
        discountValue:  200,
        minOrderAmount: 1000,
        maxUsage:       200,
        maxUsagePerUser:1,
        startDate:      new Date(),
        endDate:        new Date('2026-12-31'),
        isActive:       true,
    },
    {
        code:           'EXPIRED10',
        description:    'Expired test coupon',
        discountType:   'flat',
        discountValue:  10,
        minOrderAmount: 0,
        maxUsage:       null,
        startDate:      new Date('2020-01-01'),
        endDate:        new Date('2020-12-31'),
        isActive:       false,
    },
];

async function up() {
    for (const data of coupons) {
        const exists = await Coupon.findOne({ code: data.code });
        if (!exists) {
            await Coupon.create(data);
        }
    }
}

async function down() {
    await Coupon.deleteMany({ code: { $in: coupons.map(c => c.code) } });
}

module.exports = { name, up, down };
