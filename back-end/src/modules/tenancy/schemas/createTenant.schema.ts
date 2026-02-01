export const createTenantBodyJsonSchema = {
  type: 'object',
  required: ['name', 'email', 'cnpj'],
  properties: {
    name: { type: 'string', minLength: 1 },
    email: { type: 'string', format: 'email' },
    cnpj: { type: 'string', minLength: 14 },
  },
  additionalProperties: false,
} as const;
