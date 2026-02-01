import { UserRole } from '../../../generated/prisma/enums';

export const listUsersQueryStringJsonSchema = {
  type: 'object',
  properties: {
    page: { type: 'number', minimum: 1 },
    limit: { type: 'number', minimum: 1, maximum: 100 },
    name: { type: 'string' },
    email: { type: 'string' },
    role: {
      type: 'string',
      enum: Object.values(UserRole),
    },
  },
  additionalProperties: false,
} as const;
