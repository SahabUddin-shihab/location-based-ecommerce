const Cart = require('../models/cart.model');
const BaseRepository = require('./base.repository');

class CartRepository extends BaseRepository {
    constructor() {
        super(Cart);
    }

    async findByUser(userId) {
        return this.model.findOne({ user: userId })
            .populate('items.product', 'name slug price salePrice thumbnail stock stockStatus manageStock isActive');
    }

    async findBySession(sessionId) {
        return this.model.findOne({ sessionId })
            .populate('items.product', 'name slug price salePrice thumbnail stock stockStatus manageStock');
    }

    async upsertForUser(userId, data) {
        return this.model.findOneAndUpdate(
            { user: userId },
            data,
            { new: true, upsert: true }
        ).populate('items.product', 'name slug price salePrice thumbnail stock stockStatus');
    }

    async clearCart(userId) {
        return this.model.findOneAndUpdate(
            { user: userId },
            { $set: { items: [], coupon: null } },
            { new: true }
        );
    }
}

module.exports = CartRepository;
