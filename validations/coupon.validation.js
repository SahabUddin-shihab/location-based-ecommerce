const { z } = require('zod');
const { objectId } = require('./shared');

const couponBodyBase = z.object({
    code:                 z.string().trim().min(3).max(20).toUpperCase(),
    description:          z.string().trim().optional(),
    discountType:         z.enum(['flat', 'percent']),
    discountValue:        z.number().positive(),
    maxDiscount:          z.number().positive().optional().nullable(),
    minOrderAmount:       z.number().nonnegative().default(0),
    maxUsage:             z.number().int().positive().optional().nullable(),
    maxUsagePerUser:      z.number().int().positive().default(1),
    applicableCategories: z.array(objectId).optional(),
    applicableProducts:   z.array(objectId).optional(),
    startDate:            z.coerce.date().default(() => new Date()),
    endDate:              z.coerce.date(),
    isActive:             z.boolean().default(true),
});

const createCouponSchema = z.object({
    body: couponBodyBase
        .refine(d => d.endDate > d.startDate, {
            message: 'End date must be after start date',
            path: ['endDate'],
        })
        .refine(d => d.discountType !== 'percent' || d.discountValue <= 100, {
            message: 'Percent discount cannot exceed 100',
            path: ['discountValue'],
        }),
});

const updateCouponSchema = z.object({
    params: z.object({ id: objectId }),
    body: couponBodyBase.partial().refine(
        d => Object.keys(d).length > 0,
        { message: 'At least one field required' }
    ),
});

const getCouponSchema    = z.object({ params: z.object({ id: objectId }) });
const deleteCouponSchema = z.object({ params: z.object({ id: objectId }) });

module.exports = { createCouponSchema, updateCouponSchema, getCouponSchema, deleteCouponSchema };
