import { FastifyInstance } from 'fastify';
import { jwtAuth } from '../../middlewares/jwtAuth';
import { AuthUserPayload } from '../../types/auth';
import { sendJsonSafe } from '../../utils/sendJsonSafe';

import {
  createOs,
  joinOs,
  removeUserFromOs,
  listOsUsers,
  findMyOsList,
  listOs,
  cancelOs,
  closeOs,
} from './service-order.service';

import { CreateOsDTO, GetOsDTO, MyOsQueryList, OsQueryList } from './types';
import { GetCustomerDTO } from '../customers/types';
import { GetUserDTO } from '../users/types';
import { createOsBodyJsonSchema } from './schemas/createOs.schema';
import { removeUserFromOsBodyJsonSchema } from './schemas/removeUserFromOs.schema';
import { osStageParamsJsonSchema } from '../service-order-stage/schemas/osStageParams.schema';
import { osParamsJsonSchema } from './schemas/osParams.schema';
import { myOsListQueryJsonSchema } from './schemas/myOsListQuery';
import { tenantOsListQueryJsonSchema } from './schemas/tenantOsList.schema';

export async function serviceOrderRoutes(app: FastifyInstance) {
  app.register(async (panel) => {
    panel.addHook('preHandler', jwtAuth);

    panel.post<{ Body: CreateOsDTO; Params: GetCustomerDTO }>(
      '/customers/:id/os',
      {
        schema: {
          params: {
            type: 'object',
            required: ['id'],
            properties: {
              id: { type: 'string' },
            },
          },
          body: createOsBodyJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;

        const os = await createOs(
          {
            tenantId: user.tenantId,
            userId: user.userId,
            role: user.role,
          },
          request.body,
          request.params,
        );

        return sendJsonSafe(reply, os);
      },
    );

    panel.post<{ Params: GetOsDTO }>(
      '/os/:id/join',
      {
        schema: {
          params: osParamsJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;

        const os = await joinOs(
          {
            tenantId: user.tenantId,
            userId: user.userId,
            role: user.role,
          },
          request.params,
        );

        return sendJsonSafe(reply, os);
      },
    );

    panel.delete<{ Params: GetOsDTO; Body: GetUserDTO }>(
      '/os/:id/users',
      {
        schema: {
          params: osParamsJsonSchema,
          body: removeUserFromOsBodyJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;

        const result = await removeUserFromOs(
          {
            tenantId: user.tenantId,
            userId: user.userId,
            role: user.role,
          },
          request.params,
          request.body,
        );

        return sendJsonSafe(reply, result);
      },
    );

    panel.get<{ Params: GetOsDTO }>(
      '/os/:id/users',
      {
        schema: {
          params: osParamsJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;

        const users = await listOsUsers(
          {
            tenantId: user.tenantId,
            userId: user.userId,
            role: user.role,
          },
          request.params,
        );

        return sendJsonSafe(reply, users);
      },
    );

    panel.get<{ Querystring: MyOsQueryList }>(
      '/os/my',
      {
        schema: {
          querystring: myOsListQueryJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;

        const page = await findMyOsList(
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

    panel.get<{ Querystring: OsQueryList }>(
      '/os',
      {
        schema: {
          querystring: tenantOsListQueryJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;

        const page = await listOs(
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

    panel.post<{ Params: GetOsDTO }>(
      '/os/:id/cancel',
      {
        schema: {
          params: osParamsJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;

        const result = await cancelOs(
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

    panel.post<{ Params: GetOsDTO }>(
      '/os/:id/close',
      {
        schema: {
          params: osParamsJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;

        const os = await closeOs(
          {
            tenantId: user.tenantId,
            userId: user.userId,
            role: user.role,
          },
          request.params,
        );

        return sendJsonSafe(reply, os);
      },
    );
  });
}
