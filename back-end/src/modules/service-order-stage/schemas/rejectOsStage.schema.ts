export const rejectStageBodyJsonSchema = {
  type: 'object',
  required: ['note'],
  properties: {
    note: { type: 'string', minLength: 1 },
  },
  additionalProperties: false,
} as const;
