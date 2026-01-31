import { UserRole } from '../generated/prisma/enums';

export type TenantContext = {
  userId: string;
  tenantId: string;
  role: UserRole;
};
