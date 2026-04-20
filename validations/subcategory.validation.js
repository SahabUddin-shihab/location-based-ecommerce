const z= require('zod');

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId');

const createSubcategorySchema= z.object({
    body: z.object({
        name: z.string().min(3,'Name must be greater then 3 characters')
        .max(30,'Name must be less then 30 characters')
        .trim(),

        description: z.string().min(20, 'Description must be grater then 20 characters')
        .max(500, 'description must not be 500 characters')
        .trim(),

        category: z.string()
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId')
        .min(1, 'Category id is required'),

        status: z.boolean()
        .optional()
        .default(true),

        image: z.string()
        .optional()
    }),
});


const updateSubcategorySchema= z.object({
    params: z.object({
        id: objectIdSchema
    }),
    body: z.object({
        name: z.string().min(3,'Name must be greater then 3 characters')
        .max(30,'Name must be less then 30 characters')
        .trim(),

        description: z.string().min(20, 'Description must be grater then 20 characters')
        .max(500, 'description must not be 500 characters')
        .trim(),

        category: z.string()
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId')
        .min(1, 'Category id is required'),

        status: z.boolean()
        .optional()
        .default(true),

        image: z.string()
        .optional()
    }),
});


const getSubcategorySchema= z.object({
    params: z.object({
        id: objectIdSchema
    })
});

const deleteSubcategorySchema= z.object({
    params: z.object({
        id: objectIdSchema
    })
});

module.exports= {
    createSubcategorySchema,
    updateSubcategorySchema,
    getSubcategorySchema,
    deleteSubcategorySchema
}