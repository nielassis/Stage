export const updateOsStageBodyJsonSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
    description: { type: 'string', minLength: 1 },
  },
  additionalProperties: false,
} as const;
