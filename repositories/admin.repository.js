const Admin = require('../models/admin.model');
const BaseRepository = require('./base.repository');

class AdminRepository extends BaseRepository {
    constructor() {
        super(Admin);
    }

    async findByEmailWithPassword(email) {
        return this.model.findOne({ email: email.toLowerCase() }).select('+password');
    }
}

module.exports = AdminRepository;
