import { prisma } from '../../config/prisma';
import { Permissions } from '../../lib/permissions';
import { TenantContext } from '../../types/context';
import { cleanString, normalizeEmail } from '../../utils/cleaners';
import { AppError } from '../../utils/error';
import {
  CreateUserDTO,
  GetUserDTO,
  UpdateUserDTO,
  UserListQuery,
} from './types';
import { generateRandomPassword } from '../../utils/generateRandomPassword';
import bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { passwordSchema } from '../../schemas/validPasswordSchema';
import { normalizePagination } from '../../utils/normalizePagination';

export async function createUser(context: TenantContext, dto: CreateUserDTO) {
  Permissions.assertAdminPrivileges(context);

  const name = cleanString(dto.name);
  const email = normalizeEmail(dto.email);
  const role = dto.role ?? undefined;

  const rawPassword = generateRandomPassword(12);

  if (!name) {
    throw new AppError('Name cannot be empty');
  }

  if (!email) {
    throw new AppError('Email cannot be empty');
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new AppError('A user with this email address already exists.');
  }

  const password = await bcrypt.hash(rawPassword, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password,
      role,
      tenantId: context.tenantId,
    },
  });

  return { user, password: rawPassword };
}

export async function listTenantUsers(
  context: TenantContext,
  query: UserListQuery,
) {
  Permissions.assertHighPrivileges(context);

  const { page, limit } = normalizePagination(query.page, query.limit);

  const name = cleanString(query.name);
  const email = normalizeEmail(query.email);
  const role = query.role ?? undefined;

  const where: Prisma.UserWhereInput = {
    tenantId: context.tenantId,
    ...(name && {
      name: {
        contains: name,
        mode: 'insensitive',
      },
    }),

    ...(email && {
      email: {
        contains: email,
        mode: 'insensitive',
      },
    }),

    ...(role && {
      role: role,
    }),
  };

  const total = await prisma.user.count({ where });

  const data = await prisma.user.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
    skip: (page - 1) * limit,
    take: limit,
  });

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function deleteUser(context: TenantContext, dto: GetUserDTO) {
  Permissions.assertAdminPrivileges(context);

  const user = await prisma.user.findUnique({
    where: {
      id: dto.id,
    },
  });

  if (!user) {
    throw new AppError('Customer not found', 404);
  }

  if (context.tenantId != user?.tenantId) {
    throw new AppError('Cross-Tenant peration blocked', 403);
  }

  await prisma.user.delete({
    where: {
      id: dto.id,
    },
  });

  return 'successfully deleted';
}

export async function userConfig(context: TenantContext, dto: UpdateUserDTO) {
  const user = await prisma.user.findUnique({
    where: { id: context.userId },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }
  const name = dto.name !== undefined ? cleanString(dto.name) : user.name;
  const email =
    dto.email !== undefined ? normalizeEmail(dto.email) : user.email;

  let password: string | undefined;

  if (dto.password !== undefined) {
    const validation = passwordSchema.safeParse(dto.password);

    if (!validation.success) {
      throw new AppError('Weak password');
    }

    password = validation.data;
  }

  const updatedUser = await prisma.user.update({
    where: { id: context.userId },
    data: {
      email,
      name,
      ...(password && { password }),
    },
  });

  return updatedUser;
}

export async function getUserContext(context: TenantContext) {
  const user = await prisma.user.findUnique({
    where: { id: context.userId },
    select: {
      tenantId: true,
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
}
