import { FastifyInstance } from 'fastify';
import { jwtAuth } from '../../middlewares/jwtAuth';
import { AuthUserPayload } from '../../types/auth';
import { sendJsonSafe } from '../../utils/sendJsonSafe';

import {
  createCustomer,
  listTenantCustomers,
  updateTenantCustomer,
  getTenantUserById,
  deleteTenantCustomer,
} from './customers.service';

import {
  CreateCustomerDTO,
  CustomersListQuery,
  GetCustomerDTO,
  UpdateCustomerDTO,
} from './types';

import { customerParamsJsonSchema } from './schemas/customerParams.schema';
import { createCustomerBodyJsonSchema } from './schemas/createCustomer.schema';
import { updateCustomerBodyJsonSchema } from './schemas/updateCustomer.schema';
import { customersListQueryJsonSchema } from './schemas/customerListQuery.schema';

export async function customersRoutes(app: FastifyInstance) {
  app.register(async (panel) => {
    panel.addHook('preHandler', jwtAuth);
    panel.post<{ Body: CreateCustomerDTO }>(
      '/customers',
      {
        schema: {
          body: createCustomerBodyJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;

        const customer = await createCustomer(
          {
            tenantId: user.tenantId,
            userId: user.userId,
            role: user.role,
          },
          request.body,
        );

        return sendJsonSafe(reply, customer);
      },
    );

    panel.get<{ Querystring: CustomersListQuery }>(
      '/customers',
      {
        schema: {
          querystring: customersListQueryJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;

        const page = await listTenantCustomers(
          {
            tenantId: user.tenantId,
            userId: user.userId,
            role: user.role,
          },
          request.query,
        );

        return sendJsonSafe(reply, page);
      },
    );

    panel.get<{ Params: GetCustomerDTO }>(
      '/customers/:id',
      {
        schema: {
          params: customerParamsJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;

        const customer = await getTenantUserById(
          {
            tenantId: user.tenantId,
            userId: user.userId,
            role: user.role,
          },
          request.params,
        );

        return sendJsonSafe(reply, customer);
      },
    );

    panel.put<{ Params: GetCustomerDTO; Body: UpdateCustomerDTO }>(
      '/customers/:id',
      {
        schema: {
          params: customerParamsJsonSchema,
          body: updateCustomerBodyJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;

        const customer = await updateTenantCustomer(
          {
            tenantId: user.tenantId,
            userId: user.userId,
            role: user.role,
          },
          request.body,
          request.params,
        );

        return sendJsonSafe(reply, customer);
      },
    );

    panel.delete<{ Params: GetCustomerDTO }>(
      '/customers/:id',
      {
        schema: {
          params: customerParamsJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;

        const result = await deleteTenantCustomer(
          {
            tenantId: user.tenantId,
            userId: user.userId,
            role: user.role,
          },
          request.params,
        );

        return sendJsonSafe(reply, result);
      },
    );
  });
}
