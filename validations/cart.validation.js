const { z } = require('zod');
const { objectId } = require('./shared');

const addToCartSchema = z.object({
    body: z.object({
        productId: objectId,
        quantity:  z.number().int().positive().default(1),
        variant: z.object({
            name:  z.string().trim(),
            value: z.string().trim(),
        }).optional().nullable(),
    }),
});

const updateCartItemSchema = z.object({
    params: z.object({ itemId: z.string().min(1) }),
    body:   z.object({
        quantity: z.number().int().positive(),
    }),
});

const removeCartItemSchema = z.object({
    params: z.object({ itemId: z.string().min(1) }),
});

const applyCouponSchema = z.object({
    body: z.object({
        code: z.string().trim().min(1).toUpperCase(),
    }),
});

module.exports = {
    addToCartSchema,
    updateCartItemSchema,
    removeCartItemSchema,
    applyCouponSchema,
};
