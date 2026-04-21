const z = require('zod');

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId');

const createBrandSchema = z.object({
    body: z.object({
        name: z.string()
            .min(3, 'Name must be at least 3 characters')
            .max(40, 'Name is too long')
            .trim(),
            
        status: z.boolean().default(true)
    })
});

const updateBrandSchema = z.object({
    params: z.object({
        id: objectIdSchema
    }),
    body: z.object({
        name: z.string()
            .min(3, 'Name must be at least 3 characters')
            .max(40, 'Name is too long')
            .trim()
            .optional(),
        status: z.boolean().optional()
    }).refine(data => Object.keys(data).length > 0, {
        message: 'At least one field is required for update'
    })
});

const getBrandSchema = z.object({
    params: z.object({
        id: objectIdSchema
    })
});

const deleteBrandSchema = z.object({
    params: z.object({
        id: objectIdSchema
    })
});


module.exports = {
    createBrandSchema,
    updateBrandSchema,
    getBrandSchema,
    deleteBrandSchema
};