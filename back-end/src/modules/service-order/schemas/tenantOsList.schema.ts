export const tenantOsListQueryJsonSchema = {
  type: 'object',
  properties: {
    page: { type: 'number', minimum: 1 },
    limit: { type: 'number', minimum: 1, maximum: 100 },

    name: { type: 'string', minLength: 1 },
    responsibleName: { type: 'string', minLength: 1 },
    customerName: { type: 'string', minLength: 1 },

    status: {
      type: 'string',
      enum: ['OPEN', 'CANCELLED', 'CLOSED'],
    },
  },
  additionalProperties: false,
} as const;
