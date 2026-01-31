import { UserRole } from '../generated/prisma/enums';
import { TenantContext } from '../types/context';
import { AppError } from '../utils/error';

function isAdmin(context: TenantContext) {
  return context.role === UserRole.ADMIN;
}

function hasHighPrivileges(context: TenantContext) {
  return (
    context.role === UserRole.ADMIN || context.role === UserRole.SUPERVISOR
  );
}

export const Permissions = {
  assertAdminPrivileges(context: TenantContext): void {
    if (!isAdmin(context)) {
      throw new AppError('Only ADMIN can do this action', 403);
    }
  },

  assertHighPrivileges(context: TenantContext): void {
    if (!hasHighPrivileges(context)) {
      throw new AppError('Only ADMIN | SUPERVISOR can do this action', 403);
    }
  },
};
