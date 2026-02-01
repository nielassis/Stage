export const osStageParamsJsonSchema = {
  type: 'object',
  required: ['osId'],
  properties: {
    osId: { type: 'string', minLength: 1 },
    id: { type: 'string', minLength: 1 },
  },
  additionalProperties: false,
} as const;
