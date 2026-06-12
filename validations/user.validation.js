const { z } = require('zod');
const { objectId } = require('./shared');

const updateProfileSchema = z.object({
    body: z.object({
        name:  z.string().min(2).max(50).trim().optional(),
        phone: z.string().trim().optional(),
    }).refine(d => Object.keys(d).length > 0, { message: 'At least one field required' }),
});

const addressSchema = z.object({
    label:        z.enum(['home', 'office', 'other']).default('home'),
    name:         z.string().min(2).max(50).trim(),
    phone:        z.string().trim(),
    addressLine1: z.string().min(5).max(200).trim(),
    addressLine2: z.string().trim().optional(),
    city:         z.string().min(2).max(50).trim(),
    state:        z.string().trim().optional(),
    postalCode:   z.string().trim().optional(),
    country:      z.string().trim().default('Bangladesh'),
    isDefault:    z.boolean().default(false),
});

const addAddressSchema    = z.object({ body: addressSchema });
const updateAddressSchema = z.object({
    params: z.object({ addressId: z.string().min(1) }),
    body:   addressSchema.partial().refine(d => Object.keys(d).length > 0, { message: 'At least one field required' }),
});
const deleteAddressSchema = z.object({
    params: z.object({ addressId: z.string().min(1) }),
});

const wishlistToggleSchema = z.object({
    params: z.object({ productId: objectId }),
});

module.exports = {
    updateProfileSchema,
    addAddressSchema,
    updateAddressSchema,
    deleteAddressSchema,
    wishlistToggleSchema,
};
