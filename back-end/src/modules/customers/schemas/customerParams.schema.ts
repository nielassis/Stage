export const customerParamsJsonSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string' },
  },
  additionalProperties: false,
} as const;
