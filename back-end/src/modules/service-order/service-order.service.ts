import { tr } from 'zod/v4/locales';
import { prisma } from '../../config/prisma';
import { OsStageStatus, OsStatus, Prisma } from '../../generated/prisma/client';
import { Permissions } from '../../lib/permissions';
import { TenantContext } from '../../types/context';
import { cleanString } from '../../utils/cleaners';
import { AppError } from '../../utils/error';
import { GetCustomerDTO } from '../customers/types';
import { GetUserDTO } from '../users/types';
import {
  CreateOsDTO,
  GetOsDTO,
  MyOsItem,
  MyOsPage,
  MyOsQueryList,
  MyOsRoleFilter,
  OsPage,
  OsQueryList,
  TenantOsItem,
} from './types';

export async function createOs(
  context: TenantContext,
  dto: CreateOsDTO,
  query: GetCustomerDTO,
) {
  const customer = await prisma.customer.findUnique({
    where: {
      tenantId: context.tenantId,
      id: query.id,
    },
  });

  if (!customer) {
    throw new AppError('Customer not found', 404);
  }

  const name = cleanString(dto.name);
  const responsibleId = dto.responsibleId;
  const description = cleanString(dto.description);
  const amountCents = dto.amountCents;

  if (!name) {
    throw new AppError('Name cannot be empty');
  }

  if (!responsibleId) {
    throw new AppError('Responsible cannot be empty');
  }

  if (!description) {
    throw new AppError('Description cannot be empty');
  }

  if (!amountCents) {
    throw new AppError('Amount cannot be empty');
  }

  const os = await prisma.os.create({
    data: {
      tenantId: context.tenantId,
      name,
      description,
      amountCents,
      responsibleId: context.userId,
      customerId: query.id,
    },
  });

  await prisma.osStage.create({
    data: {
      tenantId: context.tenantId,
      osId: os.id,
      name: 'Etapa inicial',
      description: 'Ordem de serviço criada',
    },
  });

  return os;
}

export async function joinOs(context: TenantContext, query: GetOsDTO) {
  const os = await prisma.os.findUnique({
    where: {
      tenantId: context.tenantId,
      id: query.id,
    },
  });

  if (!os) {
    throw new AppError('Os not found', 404);
  }

  const updatedOs = await prisma.os.update({
    where: { id: os.id },
    data: {
      users: {
        connect: { id: context.userId },
      },
    },
    include: {
      users: true,
    },
  });

  return updatedOs;
}

export async function removeUserFromOs(
  context: TenantContext,
  query: GetOsDTO,
  dto: GetUserDTO,
) {
  Permissions.assertHighPrivileges(context);

  const os = await prisma.os.findUnique({
    where: {
      tenantId: context.tenantId,
      id: query.id,
    },
  });

  if (!os) {
    throw new AppError('Os not found', 404);
  }

  const updatedOs = await prisma.os.update({
    where: { id: os.id },
    data: {
      users: {
        disconnect: { id: dto.id },
      },
    },
  });

  return updatedOs;
}

export async function listOsUsers(context: TenantContext, query: GetOsDTO) {
  const os = await prisma.os.findFirst({
    where: {
      id: query.id,
      tenantId: context.tenantId,
    },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!os) {
    throw new AppError('Os not found', 404);
  }

  return os.users;
}

export async function findMyOsList(
  context: TenantContext,
  query: MyOsQueryList,
): Promise<MyOsPage> {
  const { page, limit } = normalizePagination(query.page, query.limit);

  const name = cleanString(query.name);
  const status = query.status ?? undefined;
  const role = query.role ?? undefined;
  const responsibleName = cleanString(query.responsibleName);

  let roleWhere: Prisma.OsWhereInput | undefined;

  if (role === MyOsRoleFilter.RESPONSIBLE) {
    roleWhere = {
      responsibleId: context.userId,
    };
  }

  if (role === MyOsRoleFilter.PARTICIPANT) {
    roleWhere = {
      users: {
        some: {
          id: context.userId,
        },
      },
    };
  }

  const where: Prisma.OsWhereInput = {
    tenantId: context.tenantId,
    ...(status && { status }),
    ...(name && {
      name: {
        contains: name,
        mode: 'insensitive',
      },
    }),
    ...(responsibleName && {
      responsible: {
        name: {
          contains: responsibleName,
          mode: 'insensitive',
        },
      },
    }),
    ...(roleWhere
      ? roleWhere
      : {
          OR: [
            { responsibleId: context.userId },
            {
              users: {
                some: {
                  id: context.userId,
                },
              },
            },
          ],
        }),
  };

  const total = await prisma.os.count({ where });

  const osList = await prisma.os.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
    select: {
      id: true,
      name: true,
      status: true,
      amountCents: true,
      createdAt: true,
      responsibleId: true,

      responsible: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      customer: {
        select: {
          id: true,
          name: true,
        },
      },

      users: {
        select: { id: true },
      },
    },
  });

  const data: MyOsItem[] = osList.map((os) => {
    const isResponsible = os.responsibleId === context.userId;

    return {
      id: os.id,
      name: os.name,
      status: os.status,
      amountCents: os.amountCents,
      responsible: os.responsible,
      createdAt: os.createdAt,
      customer: os.customer,
      myRole: isResponsible
        ? MyOsRoleFilter.RESPONSIBLE
        : MyOsRoleFilter.PARTICIPANT,
    };
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

export async function listOs(
  context: TenantContext,
  query: OsQueryList,
): Promise<OsPage> {
  const { page, limit } = normalizePagination(query.page, query.limit);

  const name = cleanString(query.name);
  const status = query.status ?? undefined;
  const responsibleName = cleanString(query.responsibleName);
  const customerName = cleanString(query.customerName);

  const where: Prisma.OsWhereInput = {
    tenantId: context.tenantId,
    ...(status && { status }),
    ...(name && {
      name: {
        contains: name,
        mode: 'insensitive',
      },
    }),
    ...(responsibleName && {
      responsible: {
        name: {
          contains: responsibleName,
          mode: 'insensitive',
        },
      },
    }),
    ...(customerName && {
      customer: {
        name: {
          contains: customerName,
          mode: 'insensitive',
        },
      },
    }),
  };

  const total = await prisma.os.count({ where });

  const osList = await prisma.os.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
    select: {
      id: true,
      name: true,
      status: true,
      amountCents: true,
      createdAt: true,
      responsibleId: true,

      responsible: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      customer: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const data: TenantOsItem[] = osList.map((os) => {
    const isResponsible = os.responsibleId === context.userId;

    return {
      id: os.id,
      name: os.name,
      status: os.status,
      amountCents: os.amountCents,
      responsible: {
        ...os.responsible,
        name: isResponsible ? 'Você' : os.responsible.name,
      },
      createdAt: os.createdAt,
      customer: os.customer,
    };
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

export async function cancelOs(context: TenantContext, dto: GetOsDTO) {
  Permissions.assertHighPrivileges(context);

  const os = await prisma.os.findUnique({
    where: {
      id: dto.id,
      tenantId: context.tenantId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!os) {
    throw new AppError('Os not found', 404);
  }

  if (os.status === OsStatus.CANCELLED) {
    throw new AppError('Os already cancelled', 400);
  }

  const now = new Date();

  await prisma.$transaction([
    prisma.os.update({
      where: {
        id: dto.id,
      },
      data: {
        status: OsStatus.CANCELLED,
        cancelledAt: now,
      },
    }),

    prisma.osStage.updateMany({
      where: {
        osId: dto.id,
        tenantId: context.tenantId,
        status: {
          not: OsStageStatus.CANCELLED,
        },
      },
      data: {
        status: OsStageStatus.CANCELLED,
        updatedAt: now,
      },
    }),
  ]);

  return {
    success: true,
  };
}

export async function closeOs(context: TenantContext, dto: GetOsDTO) {
  Permissions.assertHighPrivileges(context);

  const os = await prisma.os.findUnique({
    where: {
      id: dto.id,
      tenantId: context.tenantId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!os) {
    throw new AppError('Os not found', 404);
  }

  if (os.status === OsStatus.CANCELLED) {
    throw new AppError('Cancelled OS cannot be closed', 400);
  }

  if (os.status === OsStatus.CLOSED) {
    throw new AppError('Os already closed', 400);
  }

  const pendingStages = await prisma.osStage.count({
    where: {
      osId: dto.id,
      tenantId: context.tenantId,
      status: {
        not: OsStageStatus.COMPLETED,
      },
    },
  });

  if (pendingStages > 0) {
    throw new AppError(
      'All OS stages must be completed before closing the OS',
      400,
    );
  }

  const closedOs = await prisma.os.update({
    where: {
      id: dto.id,
    },
    data: {
      status: OsStatus.CLOSED,
      completedAt: new Date(),
    },
  });

  return closedOs;
}

export async function getOsById(context: TenantContext, dto: GetOsDTO) {
  const os = await prisma.os.findUnique({
    where: {
      tenantId: context.tenantId,
      id: dto.id,
    },
  });

  if (!os) {
    throw new AppError('Os not found', 404);
  }

  return os;
}
