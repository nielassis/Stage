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
import { Prisma } from '../../generated/prisma/client';
import { passwordSchema } from '../../schemas/validPasswordSchema';

export async function createUser(context: TenantContext, dto: CreateUserDTO) {
  Permissions.assertAdminPrivileges(context);

  if (!context.tenantId) {
    throw new AppError('No tenant associate with this user');
  }

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

  return user;
}

export async function listTenantUsers(
  context: TenantContext,
  query: UserListQuery,
) {
  Permissions.assertHighPrivileges(context);

  if (!context.tenantId) {
    throw new AppError('No tenant associate with this user');
  }

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
  if (!context.userId) {
    throw new AppError('Unauthenticated', 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: context.userId },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const dataToUpdate: Partial<{
    name: string;
    email: string;
    password: string;
  }> = {};

  if (dto.name !== undefined) {
    const name = cleanString(dto.name);
    if (!name) {
      throw new AppError('Name cannot be empty');
    }
    dataToUpdate.name = name;
  }

  if (dto.email !== undefined) {
    const email = normalizeEmail(dto.email);
    if (!email) {
      throw new AppError('Email cannot be empty');
    }
    dataToUpdate.email = email;
  }

  if (dto.password !== undefined) {
    const validation = passwordSchema.safeParse(dto.password);
    if (!validation.success) {
      throw new AppError('Weak password');
    }
    dataToUpdate.password = await bcrypt.hash(dto.password, 10);
  }

  if (Object.keys(dataToUpdate).length === 0) {
    throw new AppError('No data to update');
  }

  const updatedUser = await prisma.user.update({
    where: { id: context.userId },
    data: dataToUpdate,
  });

  return updatedUser;
}
