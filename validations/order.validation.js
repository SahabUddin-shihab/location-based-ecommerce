const { z } = require('zod');
const { objectId } = require('./shared');

const shippingAddressSchema = z.object({
    name:         z.string().min(2).max(50).trim(),
    phone:        z.string().trim(),
    addressLine1: z.string().min(5).max(200).trim(),
    addressLine2: z.string().trim().optional(),
    city:         z.string().min(2).max(50).trim(),
    state:        z.string().trim().optional(),
    postalCode:   z.string().trim().optional(),
    country:      z.string().trim().default('Bangladesh'),
});

const placeOrderSchema = z.object({
    body: z.object({
        shippingAddress: shippingAddressSchema,
        billingAddress:  shippingAddressSchema.optional(),
        paymentMethod:   z.enum(['cod', 'stripe', 'paypal', 'sslcommerz', 'bkash', 'nagad']),
        notes:           z.string().trim().max(500).optional(),
        shippingZone:    z.enum(['dhaka', 'outside_dhaka']).optional(),
    }),
});

const getOrderSchema = z.object({
    params: z.object({ id: objectId }),
});

const cancelOrderSchema = z.object({
    params: z.object({ id: objectId }),
    body:   z.object({
        reason: z.string().trim().min(1, 'Cancellation reason required').max(300),
    }),
});


const updateOrderStatusSchema = z.object({
    params: z.object({ id: objectId }),
    body: z.object({
        status: z.enum([
            'pending', 'confirmed', 'processing',
            'shipped', 'delivered', 'cancelled',
            'refunded', 'return_requested', 'returned',
        ]),
        note:           z.string().trim().max(300).optional(),
        trackingNumber: z.string().trim().optional(),
        carrier:        z.string().trim().optional(),
    }),
});

const listOrdersSchema = z.object({
    query: z.object({
        page:          z.coerce.number().int().positive().default(1),
        limit:         z.coerce.number().int().positive().max(100).default(20),
        status:        z.string().optional(),
        paymentStatus: z.string().optional(),
        paymentMethod: z.string().optional(),
        search:        z.string().trim().optional(),
        fromDate:      z.string().optional(),
        toDate:        z.string().optional(),
    }),
});

module.exports = {
    placeOrderSchema,
    getOrderSchema,
    cancelOrderSchema,
    updateOrderStatusSchema,
    listOrdersSchema,
};
