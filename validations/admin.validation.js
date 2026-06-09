const z= require('zod');

const createAdminSchema= z.object({
    body: z.object({
        name: z.string().requi
    })
});