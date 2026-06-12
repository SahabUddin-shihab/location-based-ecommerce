const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const AdminRepository = require('../repositories/admin.repository');

class AdminAuthService {
    constructor() {
        this.adminRepo = new AdminRepository();
    }

    generateToken(adminId, role) {
        return jwt.sign(
            { id: adminId, role, type: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );
    }

    async login(email, password) {
        const admin = await this.adminRepo.findByEmailWithPassword(email);
        if (!admin) throw ApiError.unauthorized('Invalid credentials');
        if (!admin.isActive) throw ApiError.forbidden('Account deactivated');

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) throw ApiError.unauthorized('Invalid credentials');

        await this.adminRepo.updateById(admin._id, { lastLogin: new Date() });

        const token = this.generateToken(admin._id, admin.role);
        return {
            admin: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                avatar: admin.avatar,
            },
            token,
        };
    }

    async createAdmin(data) {
        const exists = await this.adminRepo.findOne({ email: data.email });
        if (exists) throw ApiError.conflict('Email already registered');
        return this.adminRepo.create(data);
    }
}

module.exports = AdminAuthService;
