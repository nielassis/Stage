import { prisma } from '../../config/prisma';
import { Permissions } from '../../lib/permissions';
import { TenantContext } from '../../types/context';
import { cleanString, normalizeEmail } from '../../utils/cleaners';
import { AppError } from '../../utils/error';
import { normalizeCNPJ, validateCNPJ } from '../../utils/validateCNPJ';
import { CreateTenantDTO, UpdateTenantDTO } from './types';

export async function createTenant(
  context: TenantContext,
  dto: CreateTenantDTO,
) {
  Permissions.assertPlatformAdminPrivileges(context);

  const name = cleanString(dto.name);
  const email = normalizeEmail(dto.email);
  const cnpj = normalizeCNPJ(dto.cnpj);

  if (!validateCNPJ(cnpj)) {
    throw new AppError('Invalid CNPJ', 400);
  }

  const existingTenant = await prisma.tenant.findFirst({
    where: {
      OR: [{ name }, { email }, { cnpj }],
    },
  });

  if (existingTenant) {
    if (existingTenant.name === name) {
      throw new AppError('A tenant with this name already exists.', 409);
    }

    if (existingTenant.email === email) {
      throw new AppError('A tenant with this email already exists.', 409);
    }

    if (existingTenant.cnpj === cnpj) {
      throw new AppError('A tenant with this CNPJ already exists.', 409);
    }
  }

  if (!name) {
    throw new AppError('Name cannot be empty', 400);
  }

  if (!email) {
    throw new AppError('Email cannot be empty', 400);
  }

  const trialEndAt = new Date();
  trialEndAt.setDate(trialEndAt.getDate() + 14);

  const tenant = await prisma.tenant.create({
    data: {
      name,
      email,
      cnpj,
    },
  });

  return tenant;
}

export async function getTenant(context: TenantContext) {
  const tenant = await prisma.tenant.findUnique({
    where: { id: context.tenantId },
  });

  if (!tenant) {
    throw new AppError('Tenant not found', 404);
  }

  return tenant;
}

export async function updateTenant(
  context: TenantContext,
  dto: UpdateTenantDTO,
) {
  Permissions.assertAdminPrivileges(context);

  const tenant = await prisma.tenant.findUnique({
    where: { id: context.tenantId },
  });

  if (!tenant) {
    throw new AppError('Tenant not found', 404);
  }

  const name = dto.name !== undefined ? cleanString(dto.name) : tenant.name;
  const email =
    dto.email !== undefined ? normalizeEmail(dto.email) : tenant.email;
  let cnpj = dto.cnpj !== undefined ? normalizeCNPJ(dto.cnpj) : tenant.cnpj;

  if (cnpj && !validateCNPJ(cnpj)) {
    throw new AppError('Invalid CNPJ', 400);
  }

  const existingTenant = await prisma.tenant.findFirst({
    where: {
      OR: [{ name }, { email }, { cnpj }],
    },
  });

  if (existingTenant) {
    if (existingTenant.name === name) {
      throw new AppError('A tenant with this name already exists.', 409);
    }

    if (existingTenant.email === email) {
      throw new AppError('A tenant with this email already exists.', 409);
    }

    if (existingTenant.cnpj === cnpj) {
      throw new AppError('A tenant with this CNPJ already exists.', 409);
    }
  }

  const updatedTenant = await prisma.tenant.update({
    where: { id: context.tenantId },
    data: {
      name,
      email,
      cnpj,
    },
  });

  return updatedTenant;
}
