const router = require('express').Router();
const AuthController = require('../../controllers/user/auth.controller');
const { protect } = require('../../middleware/auth.middleware');
const { authLimiter } = require('../../middleware/rateLimiter');
const validate = require('../../middleware/validate');
const {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema,
    refreshTokenSchema,
} = require('../../validations/auth.validation');

router.post('/register',       authLimiter, validate(registerSchema),        AuthController.register);
router.post('/login',          authLimiter, validate(loginSchema),           AuthController.login);
router.post('/logout',         protect,                                      AuthController.logout);
router.post('/refresh-token',  validate(refreshTokenSchema),                 AuthController.refreshToken);
router.get('/verify-email/:token',                                           AuthController.verifyEmail);
router.post('/forgot-password',authLimiter, validate(forgotPasswordSchema),  AuthController.forgotPassword);
router.post('/reset-password/:token', authLimiter, validate(resetPasswordSchema), AuthController.resetPassword);
router.patch('/change-password', protect, validate(changePasswordSchema),   AuthController.changePassword);
router.get('/me',              protect,                                      AuthController.getMe);

module.exports = router;
