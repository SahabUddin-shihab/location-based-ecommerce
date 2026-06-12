const logger = require('../utils/logger');

let redisClient = null;
let isRedisAvailable = false;

const connectRedis = async () => {
    try {
        const Redis = require('ioredis');
        redisClient = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
            maxRetriesPerRequest: 1,
            enableReadyCheck: false,
            lazyConnect: true,
        });

        redisClient.on('connect', () => {
            isRedisAvailable = true;
            logger.info('Redis connected');
        });

        redisClient.on('error', (err) => {
            isRedisAvailable = false;
            logger.warn(`Redis unavailable: ${err.message} — caching disabled`);
        });

        await redisClient.connect();
    } catch (err) {
        isRedisAvailable = false;
        logger.warn('Redis not available — running without cache');
    }
};

const getClient = () => redisClient;
const isAvailable = () => isRedisAvailable;

const cache = {
    async get(key) {
        if (!isRedisAvailable || !redisClient) return null;
        try {
            const val = await redisClient.get(key);
            return val ? JSON.parse(val) : null;
        } catch { return null; }
    },

    async set(key, value, ttlSeconds = 300) {
        if (!isRedisAvailable || !redisClient) return;
        try {
            await redisClient.setex(key, ttlSeconds, JSON.stringify(value));
        } catch { /* silent */ }
    },

    async del(key) {
        if (!isRedisAvailable || !redisClient) return;
        try { await redisClient.del(key); } catch { /* silent */ }
    },

    async delPattern(pattern) {
        if (!isRedisAvailable || !redisClient) return;
        try {
            const keys = await redisClient.keys(pattern);
            if (keys.length) await redisClient.del(...keys);
        } catch { /* silent */ }
    },
};

module.exports = { connectRedis, getClient, isAvailable, cache };
