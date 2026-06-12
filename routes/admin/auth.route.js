const router = require('express').Router();
const AdminAuthController = require('../../controllers/admin/auth.controller');
const { adminProtect, adminRole } = require('../../middleware/auth.middleware');
const { authLimiter } = require('../../middleware/rateLimiter');
const validate = require('../../middleware/validate');
const { loginSchema } = require('../../validations/auth.validation');

router.post('/login', authLimiter, validate(loginSchema), AdminAuthController.login);
router.get('/me', adminProtect, AdminAuthController.getMe);


router.post(
    '/create-admin',
    adminProtect,
    adminRole('super_admin'),
    AdminAuthController.createAdmin
);

module.exports = router;
