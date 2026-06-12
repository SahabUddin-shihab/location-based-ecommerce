
require('dotenv').config();
const mongoose = require('mongoose');
const logger   = require('../utils/logger');

const seeds = [
    require('./seeds/01_admins.seed'),
    require('./seeds/02_cities.seed'),
    require('./seeds/03_brands.seed'),
    require('./seeds/04_categories.seed'),
    require('./seeds/05_subcategories.seed'),
    require('./seeds/06_users.seed'),
    require('./seeds/07_products.seed'),
    require('./seeds/08_coupons.seed'),
    require('./seeds/09_banners.seed'),
];

const connect = async () => {
    const uri = process.env.DATABASE_URL || process.env.DATABSE_URL;
    await mongoose.connect(uri);
    logger.info(`Database connected for seeding: ${mongoose.connection.host}`);
};

const runSeeds = async (reset = false) => {
    for (const seed of seeds) {
        const name = seed.name || 'Unknown';
        try {
            if (reset && typeof seed.down === 'function') {
                await seed.down();
                logger.info(`Cleared:  ${name}`);
            }
            await seed.up();
            logger.info(`Seeded:   ${name}`);
        } catch (err) {
            logger.error(`Failed:   ${name} — ${err.message}`);
            throw err;
        }
    }
};

const main = async () => {
    const reset = process.argv.includes('--reset');

    try {
        await connect();

        if (reset) {
            logger.info('RESET MODE: dropping existing seed data');
        } else {
            logger.info('SEED MODE: inserting missing seed data');
        }

        await runSeeds(reset);

        logger.info('All seeds completed successfully');
    } catch (err) {
        logger.error(`Seeding failed: ${err.message}`);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
    }
};

main();
