export const createOsBodyJsonSchema = {
  type: 'object',
  required: ['customerId', 'name', 'description', 'amountCents'],
  properties: {
    customerId: { type: 'string', minLength: 1 },

    name: { type: 'string', minLength: 1 },
    description: { type: 'string', minLength: 1 },
    amountCents: { type: 'number', minimum: 0 },
  },
  additionalProperties: false,
} as const;
