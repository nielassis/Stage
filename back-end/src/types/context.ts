import { UserRole } from '@prisma/client';

export type TenantContext = {
  userId: string;
  tenantId: string;
  role: UserRole;
};
