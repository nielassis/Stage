export const removeUserFromOsBodyJsonSchema = {
  type: 'object',
  required: ['userId'],
  properties: {
    userId: { type: 'string', minLength: 1 },
  },
  additionalProperties: false,
} as const;
