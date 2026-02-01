export const customersListQueryJsonSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: { type: 'string' },
    document: { type: 'string' },
    documentType: {
      type: 'string',
      enum: ['CPF', 'CNPJ'],
    },
    page: {
      type: 'number',
      minimum: 1,
    },
    limit: {
      type: 'number',
      minimum: 1,
      maximum: 100,
    },
  },
  additionalProperties: false,
} as const;
