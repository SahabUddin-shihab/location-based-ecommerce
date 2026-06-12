const { z } = require('zod');

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId');

const pagination = z.object({
    page:  z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
});

const idParam = z.object({ params: z.object({ id: objectId }) });

module.exports = { objectId, pagination, idParam };
