const { z } = require('zod');

const registerSchema = z.object({
    body: z.object({
        name:     z.string().min(2, 'Name must be at least 2 characters').max(50).trim(),
        email:    z.string().email('Invalid email').toLowerCase().trim(),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        phone:    z.string().trim().optional(),
    }),
});

const loginSchema = z.object({
    body: z.object({
        email:    z.string().email('Invalid email').toLowerCase().trim(),
        password: z.string().min(1, 'Password is required'),
    }),
});

const forgotPasswordSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email').toLowerCase().trim(),
    }),
});

const resetPasswordSchema = z.object({
    params: z.object({ token: z.string().min(1) }),
    body: z.object({
        password:        z.string().min(6, 'Password must be at least 6 characters'),
        confirmPassword: z.string().min(6),
    }).refine(d => d.password === d.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    }),
});

const changePasswordSchema = z.object({
    body: z.object({
        currentPassword: z.string().min(1, 'Current password is required'),
        newPassword:     z.string().min(6, 'New password must be at least 6 characters'),
    }),
});

const refreshTokenSchema = z.object({
    body: z.object({
        refreshToken: z.string().min(1, 'Refresh token is required'),
    }),
});

module.exports = {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema,
    refreshTokenSchema,
};
