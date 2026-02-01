import { UserRole } from '@prisma/client';

export const createUserBodyJsonSchema = {
  type: 'object',
  required: ['name', 'email'],
  properties: {
    name: { type: 'string', minLength: 1 },
    email: { type: 'string', format: 'email' },
    role: {
      type: 'string',
      enum: Object.values(UserRole),
    },
  },
  additionalProperties: false,
} as const;
