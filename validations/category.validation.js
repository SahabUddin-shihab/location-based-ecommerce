const z= require('zod');

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId');

const createCategorySchema= z.object({
    body: z.object({
        name: z.string().min(3, 'Category name should be greater then 3 character')
        .max(20, 'Category name must not be greter then 20 characters')
        .trim(),

        description: z.string().min(50, 'Description must be greater then 50 characters')
        .max(500, 'Description must be less then 500 characters')
        .trim(),

        image: z.string()
        .optional()
        .default('default-category-image.jpg'),

        city: z.string()
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId')
        .min(1, 'City id is required'),

        status: z.boolean()
        .default(1)
        .optional()
    })
});


const updateCategorySchema= z.object({
    params: z.object({
        id: objectIdSchema
    }),
    body: z.object({
        name: z.string().min(3, 'Category name should be greater then 3 character')
        .max(20, 'Category name must not be greter then 20 characters')
        .trim(),

        description: z.string().min(50, 'Description must be greater then 50 characters')
        .max(500, 'Description must be less then 500 characters')
        .trim(),

        image: z.string()
        .optional()
        .default('default-category-image.jpg'),

        city: z.string()
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId')
        .min(1, 'City id is required'),

        status: z.boolean()
        .default(1)
        .optional()
    })
});

const getCategorySchema= z.object({
    params: z.object({
        id: objectIdSchema
    }),
});

const deleteCategorySchema= z.object({
    params: z.object({
        id: objectIdSchema
    }),
});

module.exports= {
    createCategorySchema,
    updateCategorySchema,
    getCategorySchema,
    deleteCategorySchema
}