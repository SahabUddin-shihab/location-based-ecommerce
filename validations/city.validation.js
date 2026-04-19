const z = require('zod');

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId');

const createCitySchema = z.object({
    body: z.object({
        name: z.string()
            .min(3, 'Name must be at least 3 characters')
            .max(40, 'Name is too long')
            .trim(),
        status: z.boolean().default(true)
    })
});

const updateCitySchema = z.object({
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

const getCitySchema = z.object({
    params: z.object({
        id: objectIdSchema
    })
});

const deleteCitySchema = z.object({
    params: z.object({
        id: objectIdSchema
    })
});


module.exports = {
    createCitySchema,
    updateCitySchema,
    getCitySchema,
    deleteCitySchema
};