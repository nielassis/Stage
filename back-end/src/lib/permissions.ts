import { UserRole } from '@prisma/client';
import { TenantContext } from '../types/context';
import { AppError } from '../utils/error';

function isPlatformAdmin(context: TenantContext) {
  return context.role === UserRole.PLATFORM_ADMIN;
}

function isAdmin(context: TenantContext) {
  return (
    context.role === UserRole.ADMIN || context.role === UserRole.PLATFORM_ADMIN
  );
}

function hasHighPrivileges(context: TenantContext) {
  return (
    context.role === UserRole.ADMIN ||
    context.role === UserRole.SUPERVISOR ||
    context.role === UserRole.PLATFORM_ADMIN
  );
}

function hasLowPrivileges(context: TenantContext) {
  return context.role === UserRole.COLLABORATOR;
}

export const Permissions = {
  assertPlatformAdminPrivileges(context: TenantContext): void {
    if (!isPlatformAdmin(context)) {
      throw new AppError('Only PLATFORM_ADMIN can do this action', 403);
    }
  },
  assertAdminPrivileges(context: TenantContext): void {
    if (!isAdmin(context)) {
      throw new AppError('Only ADMIN | PLATFORM_ADMIN can do this action', 403);
    }
  },

  assertHighPrivileges(context: TenantContext): void {
    if (!hasHighPrivileges(context)) {
      throw new AppError(
        'Only PLATFORM_ADMIN |ADMIN | SUPERVISOR can do this action',
        403,
      );
    }
  },

  assertLowPrivileges(context: TenantContext): void {
    if (!hasLowPrivileges(context)) {
      throw new AppError('Only COLLABORATOR can do this action', 403);
    }
  },
};
