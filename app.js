require('dotenv').config();
const express = require('express');
const path    = require('path');
const cors    = require('cors');
const morgan  = require('morgan');
const helmet  = require('helmet');

const connectDB            = require('./config/database');

const errorHandler         = require('./middleware/errorHandler');
const { globalLimiter }    = require('./middleware/rateLimiter');
const logger               = require('./utils/logger');


connectDB();

const fs = require('fs');
['uploads/products', 'uploads/categories', 'uploads/brands',
 'uploads/users', 'uploads/banners'].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const app = express();

app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, 
}));
app.use(globalLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
    if (req.body && req.body.status != 'undefined') {
        req.body.status = req.body.status === 'true' || req.body.status === true;
    }
    next();
});

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200,
}));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined', {
        stream: { write: (message) => logger.info(message.trim()) },
    }));
}

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Location Based E-Commerce API is running 🚀',
        version: '1.0.0',
        env:     process.env.NODE_ENV,
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api/v1', require('./routes/api'));


app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

app.use(errorHandler);

module.exports = app;
