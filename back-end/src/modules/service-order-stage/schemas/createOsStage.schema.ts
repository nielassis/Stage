export const createOsStageBodyJsonSchema = {
  type: 'object',
  required: ['name', 'description'],
  properties: {
    name: { type: 'string', minLength: 1 },
    description: { type: 'string', minLength: 1 },
  },
  additionalProperties: false,
} as const;
