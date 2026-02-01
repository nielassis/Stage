import { prisma } from '../../config/prisma';
import { Prisma } from '../../generated/prisma/client';
import { Permissions } from '../../lib/permissions';
import { TenantContext } from '../../types/context';
import { cleanString, normalizeEmail } from '../../utils/cleaners';
import { DocumentValidator } from '../../utils/documentValidator';
import { AppError } from '../../utils/error';
import {
  CreateCustomerDTO,
  CustomersListQuery,
  GetCustomerDTO,
  UpdateCustomerDTO,
} from './types';

export async function createCustomer(
  context: TenantContext,
  dto: CreateCustomerDTO,
) {
  Permissions.assertHighPrivileges(context);

  const name = cleanString(dto.name);
  const email = normalizeEmail(dto.email);
  const documentType = dto.documentType ?? null;
  let document = cleanString(dto.document);

  if (documentType && document) {
    const result = DocumentValidator.validate(documentType, document);

    if (!result.valid) {
      throw new AppError('Document invalid', 400);
    }

    if (result.cleaned) {
      document = result.cleaned;
    }
  }

  if (document && documentType) {
    const existingWithDoc = await prisma.customer.findFirst({
      where: {
        tenantId: context.tenantId,
        document,
        documentType,
      },
    });

    if (existingWithDoc) {
      throw new AppError('A customer with this document already exists', 409);
    }
  }

  if (!name) {
    throw new AppError('Name cannot be empty');
  }

  if (!email) {
    throw new AppError('Email cannot be empty');
  }

  if (!document || !documentType) {
    throw new AppError('Document data cannot by empty');
  }

  const customer = await prisma.customer.create({
    data: {
      name,
      email,
      document,
      documentType,
      tenantId: context.tenantId,
    },
  });

  return customer;
}

export async function listTenantCustomers(
  context: TenantContext,
  query: CustomersListQuery,
) {
  Permissions.assertHighPrivileges(context);

  const { page, limit } = normalizePagination(query.page, query.limit);

  const name = cleanString(query.name);
  const email = normalizeEmail(query.email);
  const documentType = query.documentType ?? null;
  const document = query.document ?? null;

  const where: Prisma.CustomerWhereInput = {
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

    ...(document && {
      document: {
        contains: document,
        mode: 'insensitive',
      },
    }),

    ...(documentType && {
      documentType: documentType,
    }),
  };

  const total = await prisma.customer.count({ where });

  const data = await prisma.customer.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      name: true,
      email: true,
      document: true,
      documentType: true,
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

export async function updateTenantCustomer(
  context: TenantContext,
  dto: UpdateCustomerDTO,
  query: GetCustomerDTO,
) {
  Permissions.assertHighPrivileges(context);

  const customer = await prisma.customer.findUnique({
    where: {
      tenantId: context.tenantId,
      id: query.id,
    },
  });

  if (!customer) {
    throw new AppError('Customer not found', 404);
  }

  const name = dto.name !== undefined ? cleanString(dto.name) : customer.name;
  const email =
    dto.email !== undefined ? normalizeEmail(dto.email) : customer.email;
  let document =
    dto.document !== undefined ? cleanString(dto.document) : customer.document;
  const documentType =
    dto.documentType !== undefined ? dto.documentType : customer.documentType;

  if (documentType && document) {
    const result = DocumentValidator.validate(documentType, document);

    if (!result.valid) {
      throw new AppError('Invalid document', 400);
    }

    if (result.cleaned) {
      document = result.cleaned;
    }
  }

  if (!document && !email) {
    throw new AppError(
      'Customer must have at least an email or a document',
      400,
    );
  }

  if (document && documentType) {
    const duplicatedDoc = await prisma.customer.findFirst({
      where: {
        tenantId: context.tenantId,
        document,
        documentType,
        NOT: { id: query.id },
      },
    });

    if (duplicatedDoc) {
      throw new AppError('Já existe um usuário final com este documento.', 409);
    }
  }

  return prisma.customer.update({
    where: {
      id: query.id,
      tenantId: context.tenantId,
    },
    data: {
      name,
      email,
      document,
      documentType,
    },
    select: {
      id: true,
      name: true,
      email: true,
      document: true,
      documentType: true,
    },
  });
}

export async function getTenantUserById(
  context: TenantContext,
  query: GetCustomerDTO,
) {
  Permissions.assertHighPrivileges(context);

  return prisma.customer.findUnique({
    where: {
      id: query.id,
      tenantId: context.tenantId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      document: true,
      documentType: true,
    },
  });
}

export async function deleteTenantCustomer(
  context: TenantContext,
  query: GetCustomerDTO,
) {
  Permissions.assertAdminPrivileges(context);

  const customer = await prisma.customer.findUnique({
    where: {
      id: query.id,
    },
  });

  if (!customer) {
    throw new AppError('Customer not found', 404);
  }

  if (context.tenantId != customer?.tenantId) {
    throw new AppError('Cross-Tenant peration blocked', 403);
  }

  await prisma.customer.delete({
    where: {
      id: query.id,
    },
  });

  return 'successfully deleted';
}
