const User = require('../models/user.model');
const BaseRepository = require('./base.repository');

class UserRepository extends BaseRepository {
    constructor() {
        super(User);
    }

    async findByEmail(email, includePassword = false) {
        let query = this.model.findOne({ email: email.toLowerCase() });
        if (includePassword) query = query.select('+password');
        return query;
    }

    async findByEmailWithTokens(email) {
        return this.model.findOne({ email: email.toLowerCase() })
            .select('+password +emailVerificationToken +emailVerificationExpires +passwordResetToken +passwordResetExpires +refreshToken');
    }

    async findByRefreshToken(token) {
        return this.model.findOne({ refreshToken: token }).select('+refreshToken');
    }

    async findByVerificationToken(token) {
        return this.model.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: Date.now() }
        }).select('+emailVerificationToken +emailVerificationExpires');
    }

    async findByResetToken(token) {
        return this.model.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() }
        }).select('+password +passwordResetToken +passwordResetExpires');
    }

    async addToWishlist(userId, productId) {
        return this.model.findByIdAndUpdate(
            userId,
            { $addToSet: { wishlist: productId } },
            { new: true }
        ).populate('wishlist', 'name price salePrice thumbnail slug');
    }

    async removeFromWishlist(userId, productId) {
        return this.model.findByIdAndUpdate(
            userId,
            { $pull: { wishlist: productId } },
            { new: true }
        );
    }
}

module.exports = UserRepository;
