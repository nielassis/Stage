export const createCustomerBodyJsonSchema = {
  type: 'object',
  required: ['name', 'email', 'document', 'documentType'],
  properties: {
    name: { type: 'string', minLength: 1 },
    email: { type: 'string', minLength: 1 },
    document: { type: 'string', minLength: 1 },
    documentType: {
      type: 'string',
      enum: ['CPF', 'CNPJ'],
    },
  },
  additionalProperties: false,
} as const;
