const rateLimit = require('express-rate-limit');
const ApiError = require('../utils/ApiError');

const createLimiter = (windowMs, max, message) =>
    rateLimit({
        windowMs,
        max,
        message: { success: false, message },
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res) => {
            res.status(429).json({ success: false, message });
        },
    });

const globalLimiter = createLimiter(
    Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    Number(process.env.RATE_LIMIT_MAX) || 100,
    'Too many requests, please try again later'
);

const authLimiter = createLimiter(
    15 * 60 * 1000,  // 15 min
    10,
    'Too many auth attempts. Please try again after 15 minutes'
);

const searchLimiter = createLimiter(
    60 * 1000,  // 1 min
    30,
    'Too many search requests'
);

const orderLimiter = createLimiter(
    60 * 1000,
    5,
    'Too many order requests. Please slow down'
);

module.exports = { globalLimiter, authLimiter, searchLimiter, orderLimiter };
