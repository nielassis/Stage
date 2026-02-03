import { prisma } from '../../config/prisma';
import { Prisma, OsStatus } from '@prisma/client';
import { Permissions } from '../../lib/permissions';
import { TenantContext } from '../../types/context';
import { DateRangeQuery } from './types';
import { normalizePagination } from '../../utils/normalizePagination';

function dateFilter(query: DateRangeQuery): Prisma.DateTimeFilter | undefined {
  if (!query.startDate && !query.endDate) return undefined;

  return {
    ...(query.startDate && { gte: query.startDate }),
    ...(query.endDate && { lte: query.endDate }),
  };
}

export async function customersGrowthReport(
  context: TenantContext,
  query: DateRangeQuery,
) {
  Permissions.assertHighPrivileges(context);

  const createdAt = dateFilter(query);

  const totalCustomers = await prisma.customer.count({
    where: { tenantId: context.tenantId },
  });

  const newCustomers = await prisma.customer.count({
    where: {
      tenantId: context.tenantId,
      ...(createdAt && { createdAt }),
    },
  });

  return { totalCustomers, newCustomers };
}

export async function osStatusReport(
  context: TenantContext,
  query: DateRangeQuery,
) {
  const createdAt = dateFilter(query);

  const result = await prisma.os.groupBy({
    by: ['status'],
    where: {
      tenantId: context.tenantId,
      ...(createdAt && { createdAt }),
    },
    _count: { status: true },
  });

  return result.map((r) => ({
    status: r.status,
    total: r._count.status,
  }));
}

export async function osFinancialReport(
  context: TenantContext,
  query: DateRangeQuery,
) {
  Permissions.assertAdminPrivileges(context);

  const createdAt = dateFilter(query);

  const agg = await prisma.os.aggregate({
    where: {
      tenantId: context.tenantId,
      ...(createdAt && { createdAt }),
      status: { not: OsStatus.CANCELLED },
    },
    _sum: { amountCents: true },
    _avg: { amountCents: true },
  });

  return {
    totalAmountCents: agg._sum.amountCents ?? 0,
    avgAmountCents: Math.round(agg._avg.amountCents ?? 0),
  };
}

export async function osListReport(context: TenantContext) {
  const where: Prisma.OsWhereInput = {
    tenantId: context.tenantId,
    createdAt: {
      gte: new Date(new Date().setDate(new Date().getDate() - 7)),
    },
  };

  const data = await prisma.os.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: {
      id: true,
      name: true,
      status: true,
      amountCents: true,
      createdAt: true,
      responsible: {
        select: { name: true, id: true },
      },
    },
  });

  return {
    data,
  };
}

export async function stageStatusReport(
  context: TenantContext,
  query: DateRangeQuery,
) {
  Permissions.assertHighPrivileges(context);

  const createdAt = dateFilter(query);

  const data = await prisma.osStage.groupBy({
    by: ['status'],
    where: {
      tenantId: context.tenantId,
      ...(createdAt && { createdAt }),
    },
    _count: { status: true },
  });

  return data.map((s) => ({
    status: s.status,
    total: s._count.status,
  }));
}

export async function stageTimelineReport(context: TenantContext) {
  return prisma.osStage.findMany({
    where: {
      tenantId: context.tenantId,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 7)),
        lte: new Date(),
      },
    },
    orderBy: { updatedAt: 'desc' },
    take: 5,

    select: {
      id: true,
      os: { select: { responsible: { select: { name: true, id: true } } } },
      osId: true,
      name: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function userProductivityReport(
  context: TenantContext,
  query: DateRangeQuery,
) {
  const createdAt = dateFilter(query);

  const users = await prisma.user.findMany({
    where: { tenantId: context.tenantId },
    select: {
      id: true,
      name: true,

      responsibleOs: {
        where: createdAt ? { createdAt } : undefined,
        select: { id: true },
      },

      os: {
        where: createdAt ? { createdAt } : undefined,
        select: { id: true },
      },
    },
  });
  return users.map((u) => ({
    userId: u.id,
    name: u.name,
    responsibleCount: u.responsibleOs.length,
    participantCount: u.os.length,
  }));
}

export async function myOsSummaryReport(
  context: TenantContext,
  query: DateRangeQuery,
) {
  const createdAt = dateFilter(query);

  const total = await prisma.os.count({
    where: {
      tenantId: context.tenantId,
      ...(createdAt && { createdAt }),
      OR: [
        { responsibleId: context.userId },
        {
          users: { some: { id: context.userId } },
        },
      ],
    },
  });

  return { total };
}
