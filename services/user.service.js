const BaseService = require('./base.service');
const UserRepository = require('../repositories/user.repository');
const ApiError = require('../utils/ApiError');

class UserService extends BaseService {
    constructor() {
        super(new UserRepository());
    }

    async getProfile(userId) {
        const user = await this.repository.findById(userId, [
            { path: 'wishlist', select: 'name slug price salePrice thumbnail averageRating' },
        ]);
        if (!user) throw ApiError.notFound('User not found');
        return user;
    }

    async updateProfile(userId, data) {
        const allowedFields = ['name', 'phone', 'avatar'];
        const updateData = {};
        allowedFields.forEach(f => { if (data[f] !== undefined) updateData[f] = data[f]; });
        return this.repository.updateById(userId, updateData);
    }

    async addAddress(userId, addressData) {
        const user = await this.repository.findById(userId);
        if (!user) throw ApiError.notFound('User not found');

        if (addressData.isDefault) {
            user.addresses.forEach(a => { a.isDefault = false; });
        }
        if (user.addresses.length === 0) addressData.isDefault = true;

        user.addresses.push(addressData);
        await user.save();
        return user.addresses;
    }

    async updateAddress(userId, addressId, addressData) {
        const user = await this.repository.findById(userId);
        if (!user) throw ApiError.notFound('User not found');

        const addrIdx = user.addresses.findIndex(a => a._id.toString() === addressId);
        if (addrIdx === -1) throw ApiError.notFound('Address not found');

        if (addressData.isDefault) {
            user.addresses.forEach(a => { a.isDefault = false; });
        }
        Object.assign(user.addresses[addrIdx], addressData);
        await user.save();
        return user.addresses;
    }

    async deleteAddress(userId, addressId) {
        const user = await this.repository.findById(userId);
        if (!user) throw ApiError.notFound('User not found');

        const before = user.addresses.length;
        user.addresses = user.addresses.filter(a => a._id.toString() !== addressId);
        if (user.addresses.length === before) throw ApiError.notFound('Address not found');

        // Ensure one default
        if (user.addresses.length && !user.addresses.some(a => a.isDefault)) {
            user.addresses[0].isDefault = true;
        }
        await user.save();
        return user.addresses;
    }

    async getWishlist(userId) {
        const user = await this.repository.findById(userId, {
            path: 'wishlist',
            select: 'name slug price salePrice thumbnail averageRating reviewCount stockStatus'
        });
        if (!user) throw ApiError.notFound('User not found');
        return user.wishlist;
    }

    async toggleWishlist(userId, productId) {
        const user = await this.repository.findById(userId);
        if (!user) throw ApiError.notFound('User not found');

        const inWishlist = user.wishlist.map(id => id.toString()).includes(productId.toString());
        if (inWishlist) {
            await this.repository.removeFromWishlist(userId, productId);
            return { action: 'removed' };
        } else {
            await this.repository.addToWishlist(userId, productId);
            return { action: 'added' };
        }
    }

    async getRecentlyViewed(userId) {
        const user = await this.repository.findById(userId, {
            path: 'recentlyViewed.product',
            select: 'name slug price salePrice thumbnail averageRating'
        });
        if (!user) throw ApiError.notFound('User not found');
        return user.recentlyViewed;
    }

    async addToRecentlyViewed(userId, productId) {
        const user = await this.repository.findById(userId);
        if (!user) return;
        user.addToRecentlyViewed(productId);
        await user.save();
    }

    // Admin: list all users
    async getAllUsers(filters = {}, options = {}) {
        const query = {};
        if (filters.search) {
            query.$or = [
                { name: { $regex: filters.search, $options: 'i' } },
                { email: { $regex: filters.search, $options: 'i' } }
            ];
        }
        if (filters.isActive !== undefined) query.isActive = filters.isActive;

        const [users, total] = await Promise.all([
            this.repository.find(query, options),
            this.repository.count(query),
        ]);
        return { users, total };
    }
}

module.exports = UserService;
