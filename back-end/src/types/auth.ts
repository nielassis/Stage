import { JwtPayload } from 'jsonwebtoken';
import { UserRole } from '../generated/prisma/enums';

export type TenantContextPayload = {
  tenantId: string;
  role: UserRole;
};

export type AuthUserPayload = JwtPayload & {
  userId: string;
  tenantId: string;
  role: UserRole;
};
