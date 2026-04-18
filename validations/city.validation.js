const z= require('zod')


const createCitySchema= z.object({
    body: z.object({
        name: z.string({
            required_error: 'Name is required',
            invalid_type_error: 'Name must be a string'
        }).min(3, 'Name must be at least 3 characters').max(40,'Name is too long'),
        statu: z.boolean().default(true)
    })
})

const updateCitySchema= z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-f]{24}$/, 'Invalid Category ID')
    }),
    body: z.object({
        name: z.string().min(3, 'Name must be greater then 3 character'),
        statu: z.boolean().default(1)
    })
})

const getCitySchema= z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-f]{24}$/,'Invalide city ID')
    })
});

const deleteCitySchema= z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-f]{24}$/,'Invalide city ID')
    })
});

module.exports= {
    createCitySchema,
    updateCitySchema,
    getCitySchema,
    deleteCitySchema
}