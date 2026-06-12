const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const ApiError = require('../utils/ApiError');
const UserRepository = require('../repositories/user.repository');
const EmailService = require('./email.service');

class AuthService {
    constructor() {
        this.userRepo = new UserRepository();
        this.emailService = new EmailService();
    }

    generateTokens(userId) {
        const accessToken = jwt.sign(
            { id: userId, type: 'access' },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );
        const refreshToken = jwt.sign(
            { id: userId, type: 'refresh' },
            process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
        );
        return { accessToken, refreshToken };
    }

    generateAdminToken(adminId, role) {
        return jwt.sign(
            { id: adminId, role, type: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );
    }

    verifyToken(token, secret = null) {
        try {
            return jwt.verify(token, secret || process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === 'TokenExpiredError') throw ApiError.unauthorized('Token expired');
            throw ApiError.unauthorized('Invalid token');
        }
    }

    async register(data) {
        const exists = await this.userRepo.findByEmail(data.email);
        if (exists) throw ApiError.conflict('Email already registered');

        const verificationToken = crypto.randomBytes(32).toString('hex');
        const user = await this.userRepo.create({
            ...data,
            emailVerificationToken: verificationToken,
            emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });


        this.emailService.sendVerificationEmail(user.email, user.name, verificationToken).catch(() => {});

        const { accessToken, refreshToken } = this.generateTokens(user._id);
        await this.userRepo.updateById(user._id, { refreshToken });

        return { user: this._sanitize(user), accessToken, refreshToken };
    }

    async login(email, password) {
        const user = await this.userRepo.findByEmail(email, true);
        if (!user) throw ApiError.unauthorized('Invalid email or password');
        if (!user.isActive) throw ApiError.forbidden('Account is deactivated');

        const isMatch = await user.comparePassword(password);
        if (!isMatch) throw ApiError.unauthorized('Invalid email or password');

        const { accessToken, refreshToken } = this.generateTokens(user._id);
        await this.userRepo.updateById(user._id, { refreshToken, lastLogin: new Date() });

        return { user: this._sanitize(user), accessToken, refreshToken };
    }

    async logout(userId) {
        await this.userRepo.updateById(userId, { refreshToken: null });
    }

    async refreshAccessToken(token) {
        const decoded = this.verifyToken(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
        const user = await this.userRepo.findByRefreshToken(token);
        if (!user) throw ApiError.unauthorized('Invalid refresh token');

        const { accessToken, refreshToken } = this.generateTokens(user._id);
        await this.userRepo.updateById(user._id, { refreshToken });
        return { accessToken, refreshToken };
    }

    async verifyEmail(token) {
        const user = await this.userRepo.findByVerificationToken(token);
        if (!user) throw ApiError.badRequest('Invalid or expired verification token');

        await this.userRepo.updateById(user._id, {
            isEmailVerified: true,
            emailVerificationToken: undefined,
            emailVerificationExpires: undefined
        });
        return user;
    }

    async forgotPassword(email) {
        const user = await this.userRepo.findByEmail(email);
        if (!user) return; 

        const resetToken = crypto.randomBytes(32).toString('hex');
        await this.userRepo.updateById(user._id, {
            passwordResetToken: resetToken,
            passwordResetExpires: new Date(Date.now() + 60 * 60 * 1000)
        });

        this.emailService.sendPasswordResetEmail(user.email, user.name, resetToken).catch(() => {});
    }

    async resetPassword(token, newPassword) {
        const user = await this.userRepo.findByResetToken(token);
        if (!user) throw ApiError.badRequest('Invalid or expired reset token');

        user.password = newPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
    }

    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.userRepo.findById(userId);
        const full = await this.userRepo.findByEmail(user.email, true);
        const isMatch = await full.comparePassword(currentPassword);
        if (!isMatch) throw ApiError.badRequest('Current password is incorrect');

        full.password = newPassword;
        await full.save();
    }

    _sanitize(user) {
        const u = user.toObject ? user.toObject() : user;
        delete u.password;
        delete u.emailVerificationToken;
        delete u.emailVerificationExpires;
        delete u.passwordResetToken;
        delete u.passwordResetExpires;
        delete u.refreshToken;
        return u;
    }
}

module.exports = AuthService;
