const { z } = require('zod');
const { objectId } = require('./shared');

const variantOptionSchema = z.object({
    value:     z.string().trim(),
    sku:       z.string().trim().optional(),
    price:     z.number().nonnegative().optional(),
    salePrice: z.number().nonnegative().optional(),
    stock:     z.number().int().nonnegative().default(0),
    image:     z.string().optional(),
});

const variantSchema = z.object({
    name:    z.string().trim(),
    options: z.array(variantOptionSchema).min(1),
});

const seoSchema = z.object({
    metaTitle:       z.string().max(70).optional(),
    metaDescription: z.string().max(160).optional(),
    metaKeywords:    z.array(z.string()).optional(),
    ogImage:         z.string().optional(),
}).optional();

const productBodyBase = z.object({
    name:              z.string().min(2).max(200).trim(),
    description:       z.string().min(10).trim(),
    shortDescription:  z.string().max(500).trim().optional(),
    category:          objectId,
    subcategory:       objectId.optional(),
    brand:             objectId.optional(),
    tags:              z.array(z.string().trim().toLowerCase()).optional(),
    price:             z.coerce.number().positive(),
    salePrice:         z.coerce.number().nonnegative().optional().nullable(),
    saleStartDate:     z.coerce.date().optional(),
    saleEndDate:       z.coerce.date().optional(),
    costPrice:         z.coerce.number().nonnegative().optional(),
    taxClass:          z.enum(['standard', 'reduced', 'zero', 'none']).default('standard'),
    taxRate:           z.coerce.number().min(0).max(100).default(0),
    weight:            z.coerce.number().nonnegative().optional(),
    stock:             z.coerce.number().int().nonnegative().default(0),
    lowStockThreshold: z.coerce.number().int().nonnegative().default(5),
    manageStock:       z.coerce.boolean().default(true),
    isFreeShipping:    z.coerce.boolean().default(false),
    hasVariants:       z.coerce.boolean().default(false),
    variants:          z.array(variantSchema).optional(),
    attributes:        z.array(z.object({ key: z.string(), value: z.string() })).optional(),
    isFeatured:        z.coerce.boolean().default(false),
    isNewArrival:      z.coerce.boolean().default(false),
    isBestSeller:      z.coerce.boolean().default(false),
    isActive:          z.coerce.boolean().default(true),
    isDigital:         z.coerce.boolean().default(false),
    seo:               seoSchema,
    sku:               z.string().trim().optional(),
});


const createProductSchema = z.object({ body: productBodyBase });

const updateProductSchema = z.object({
    params: z.object({ id: objectId }),
    body:   productBodyBase.partial().refine(
        d => Object.keys(d).length > 0,
        { message: 'At least one field required' }
    ),
});

const getProductSchema    = z.object({ params: z.object({ id: objectId }) });
const deleteProductSchema = z.object({ params: z.object({ id: objectId }) });

const approveReviewSchema = z.object({
    params: z.object({ id: objectId, reviewId: objectId }),
});

const searchProductsSchema = z.object({
    query: z.object({
        keyword:     z.string().trim().optional(),
        category:    objectId.optional(),
        subcategory: objectId.optional(),
        brand:       z.union([objectId, z.array(objectId)]).optional(),
        minPrice:    z.coerce.number().nonnegative().optional(),
        maxPrice:    z.coerce.number().nonnegative().optional(),
        rating:      z.coerce.number().min(1).max(5).optional(),
        inStock:     z.coerce.boolean().optional(),
        sort:        z.enum(['newest', 'price_asc', 'price_desc', 'rating', 'popular']).default('newest'),
        page:        z.coerce.number().int().positive().default(1),
        limit:       z.coerce.number().int().positive().max(100).default(20),
    }),
});

const productSlugSchema = z.object({
    params: z.object({ slug: z.string().min(1) }),
});

const addReviewSchema = z.object({
    params: z.object({ id: objectId }),
    body: z.object({
        rating:  z.number().int().min(1).max(5),
        title:   z.string().trim().max(100).optional(),
        comment: z.string().trim().max(1000).optional(),
    }),
});

module.exports = {
    createProductSchema,
    updateProductSchema,
    getProductSchema,
    deleteProductSchema,
    approveReviewSchema,
    searchProductsSchema,
    productSlugSchema,
    addReviewSchema,
};
