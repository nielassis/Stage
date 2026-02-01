import { prisma } from '../../config/prisma';
import { OsStageStatus } from '@prisma/client';
import { Permissions } from '../../lib/permissions';
import { TenantContext } from '../../types/context';
import { cleanString } from '../../utils/cleaners';
import { AppError } from '../../utils/error';
import {
  CreateOsStageDTO,
  GetOsStageDTO,
  RejectStageDTO,
  UpdateStageDTO,
} from './types';

export async function createOsStage(
  context: TenantContext,
  dto: CreateOsStageDTO,
) {
  const name = cleanString(dto.name);
  const description = cleanString(dto.description);

  if (!name) {
    throw new AppError('Name cannot be empty', 400);
  }

  if (!description) {
    throw new AppError('Description cannot be empty', 400);
  }

  const os = await prisma.os.findUnique({
    where: {
      id: dto.osId,
      tenantId: context.tenantId,
    },
  });

  if (!os) {
    throw new AppError('Os not found', 404);
  }

  const osStage = await prisma.osStage.create({
    data: {
      tenantId: context.tenantId,
      name,
      description,
      osId: dto.osId,
    },
  });

  return osStage;
}

export async function listStages(context: TenantContext, dto: GetOsStageDTO) {
  const os = await prisma.os.findUnique({
    where: {
      id: dto.osId,
      tenantId: context.tenantId,
    },
  });

  if (!os) {
    throw new AppError('Os not found', 404);
  }

  const stages = await prisma.osStage.findMany({
    where: {
      osId: dto.osId,
      tenantId: context.tenantId,
    },
  });

  if (!stages) {
    throw new AppError('Stages not found', 404);
  }

  return stages;
}

export async function requestStageForApproval(
  context: TenantContext,
  dto: GetOsStageDTO,
) {
  Permissions.assertLowPrivileges(context);

  const os = await prisma.os.findUnique({
    where: {
      id: dto.osId,
      tenantId: context.tenantId,
    },
  });

  if (!os) {
    throw new AppError('Os not found', 404);
  }

  const stage = await prisma.osStage.findUnique({
    where: {
      id: dto.id,
      osId: dto.osId,
      tenantId: context.tenantId,
    },
  });

  if (!stage) {
    throw new AppError('Stage not found', 404);
  }

  if (
    stage.status === OsStageStatus.COMPLETED ||
    stage.status === OsStageStatus.CANCELLED
  ) {
    throw new AppError('Stage is not able to be approved', 400);
  }

  const updatedStage = await prisma.osStage.update({
    where: { id: stage.id },
    data: { status: OsStageStatus.PENDING_APPROVAL },
  });

  return updatedStage;
}

export async function approvalStage(
  context: TenantContext,
  dto: GetOsStageDTO,
) {
  Permissions.assertHighPrivileges(context);

  const os = await prisma.os.findUnique({
    where: {
      id: dto.osId,
      tenantId: context.tenantId,
    },
  });

  if (!os) {
    throw new AppError('Os not found', 404);
  }

  const stage = await prisma.osStage.findUnique({
    where: {
      id: dto.id,
      osId: dto.osId,
      tenantId: context.tenantId,
      status: OsStageStatus.PENDING_APPROVAL,
    },
  });

  if (!stage) {
    throw new AppError('Stage not found', 404);
  }

  if (stage.status !== OsStageStatus.PENDING_APPROVAL) {
    throw new AppError('Stage is not pending approval', 400);
  }

  const updatedStage = await prisma.osStage.update({
    where: { id: stage.id },
    data: { status: OsStageStatus.COMPLETED },
  });

  return updatedStage;
}

export async function rejectStage(
  context: TenantContext,
  query: GetOsStageDTO,
  dto: RejectStageDTO,
) {
  Permissions.assertHighPrivileges(context);
  const notes = cleanString(dto.note);

  const os = await prisma.os.findUnique({
    where: {
      id: query.osId,
      tenantId: context.tenantId,
    },
  });

  if (!os) {
    throw new AppError('Os not found', 404);
  }

  const stage = await prisma.osStage.findUnique({
    where: {
      id: query.id,
      osId: query.osId,
      tenantId: context.tenantId,
      status: OsStageStatus.PENDING_APPROVAL,
    },
  });

  if (!stage) {
    throw new AppError('Stage not found', 404);
  }

  if (stage.status !== OsStageStatus.PENDING_APPROVAL) {
    throw new AppError('Stage is not pending approval', 400);
  }

  const updatedStage = await prisma.osStage.update({
    where: { id: stage.id },
    data: { status: OsStageStatus.REJECTED, notes },
  });

  return updatedStage;
}

export async function updateStage(
  context: TenantContext,
  dto: UpdateStageDTO,
  query: GetOsStageDTO,
) {
  Permissions.assertHighPrivileges(context);

  const stage = await prisma.osStage.findUnique({
    where: {
      id: query.id,
      osId: query.osId,
      tenantId: context.tenantId,
    },
  });

  if (!stage) {
    throw new AppError('Stage not found', 404);
  }

  const name = dto.name !== undefined ? cleanString(dto.name) : stage.name;
  const description =
    dto.description !== undefined
      ? cleanString(dto.description)
      : stage.description;

  const updatedStage = await prisma.osStage.update({
    where: { id: stage.id, tenantId: context.tenantId },
    data: { name, description },
  });

  return updatedStage;
}

export async function deleteStage(
  context: TenantContext,
  query: GetOsStageDTO,
) {
  Permissions.assertHighPrivileges(context);

  const stage = await prisma.osStage.findUnique({
    where: {
      id: query.id,
      osId: query.osId,
      tenantId: context.tenantId,
    },
  });

  if (!stage) {
    throw new AppError('Stage not found', 404);
  }

  await prisma.osStage.delete({
    where: { id: stage.id, tenantId: context.tenantId },
  });

  return 'successfully deleted';
}
