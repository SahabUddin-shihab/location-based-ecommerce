const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user.model');
const Admin = require('../models/admin.model');

// User auth
const protect = catchAsync(async (req, res, next) => {
    const token = extractToken(req);
    if (!token) throw ApiError.unauthorized('Authentication required');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== 'access' && decoded.type !== undefined) {
        if (decoded.type === 'admin') throw ApiError.forbidden('Admin token used on user route');
    }

    const user = await User.findById(decoded.id);
    if (!user) throw ApiError.unauthorized('User no longer exists');
    if (!user.isActive) throw ApiError.forbidden('Account deactivated');

    req.user = user;
    next();
});

// Optional auth (doesn't fail if no token)
const optionalAuth = catchAsync(async (req, res, next) => {
    const token = extractToken(req);
    if (!token) return next();

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (user && user.isActive) req.user = user;
    } catch { /* no-op */ }
    next();
});

// Admin auth
const adminProtect = catchAsync(async (req, res, next) => {
    const token = extractToken(req);
    if (!token) throw ApiError.unauthorized('Authentication required');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== 'admin') throw ApiError.forbidden('Admin access required');

    const admin = await Admin.findById(decoded.id);
    if (!admin) throw ApiError.unauthorized('Admin no longer exists');
    if (!admin.isActive) throw ApiError.forbidden('Admin account deactivated');

    req.admin = admin;
    req.adminRole = decoded.role;
    next();
});

// Role-based authorization for admin
const adminRole = (...roles) => (req, res, next) => {
    if (!roles.includes(req.admin?.role)) {
        throw ApiError.forbidden('You do not have permission to perform this action');
    }
    next();
};

function extractToken(req) {
    if (req.headers.authorization?.startsWith('Bearer ')) {
        return req.headers.authorization.split(' ')[1];
    }
    if (req.cookies?.token) return req.cookies.token;
    return null;
}

module.exports = { protect, optionalAuth, adminProtect, adminRole };
