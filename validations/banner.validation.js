const { z } = require('zod');
const { objectId } = require('./shared');

const createBannerSchema = z.object({
    body: z.object({
        title:       z.string().trim().min(2).max(100),
        subtitle:    z.string().trim().optional(),
        link:        z.string().trim().optional(),
        buttonText:  z.string().trim().optional(),
        position:    z.enum(['hero', 'sidebar', 'mid_page', 'footer', 'popup']).default('hero'),
        order:       z.coerce.number().int().nonnegative().default(0),
        isActive:    z.coerce.boolean().default(true),
        startDate:   z.coerce.date().optional().nullable(),
        endDate:     z.coerce.date().optional().nullable(),
    }),
});

const updateBannerSchema = z.object({
    params: z.object({ id: objectId }),
    body:   createBannerSchema.shape.body.partial()
                .refine(d => Object.keys(d).length > 0, { message: 'At least one field required' }),
});

const getBannerSchema    = z.object({ params: z.object({ id: objectId }) });
const deleteBannerSchema = z.object({ params: z.object({ id: objectId }) });

module.exports = { createBannerSchema, updateBannerSchema, getBannerSchema, deleteBannerSchema };
