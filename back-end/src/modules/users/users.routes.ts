import { FastifyInstance } from 'fastify';
import { jwtAuth } from '../../middlewares/jwtAuth';
import {
  createUser,
  deleteUser,
  getUserContext,
  listTenantUsers,
  userConfig,
} from './users.service';

import { AuthUserPayload } from '../../types/auth';
import { sendJsonSafe } from '../../utils/sendJsonSafe';
import {
  CreateUserDTO,
  GetUserDTO,
  UpdateUserDTO,
  UserListQuery,
} from './types';
import { createUserBodyJsonSchema } from './schemas/createUser.schema';
import { listUsersQueryStringJsonSchema } from './schemas/updateUser.schema';
import { userIdParamsJsonSchema } from './schemas/userIdParams.schema';
import { updateUserBodyJsonSchema } from './schemas/listUserQuery.schema';

export async function usersRoutes(app: FastifyInstance) {
  app.register(async (panel) => {
    panel.addHook('preHandler', jwtAuth);

    panel.post<{ Body: CreateUserDTO }>(
      '/users',
      {
        schema: {
          body: createUserBodyJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;

        const result = await createUser(
          {
            tenantId: user.tenantId,
            userId: user.userId,
            role: user.role,
          },
          request.body,
        );

        return sendJsonSafe(reply, result);
      },
    );

    panel.get<{ Querystring: UserListQuery }>(
      '/users',
      {
        schema: {
          querystring: listUsersQueryStringJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;

        const users = await listTenantUsers(
          {
            tenantId: user.tenantId,
            userId: user.userId,
            role: user.role,
          },
          request.query,
        );

        return sendJsonSafe(reply, users);
      },
    );

    panel.delete<{ Params: GetUserDTO }>(
      '/users/:id',
      {
        schema: {
          params: userIdParamsJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;

        const result = await deleteUser(
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

    panel.put<{ Body: UpdateUserDTO }>(
      '/users/me',
      {
        schema: {
          body: updateUserBodyJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;

        const updated = await userConfig(
          {
            tenantId: user.tenantId,
            userId: user.userId,
            role: user.role,
          },
          request.body,
        );

        return sendJsonSafe(reply, updated);
      },
    );

    panel.get('/users/me', async (request, reply) => {
      const user = request.authUserPayload as AuthUserPayload;

      const me = await getUserContext({
        tenantId: user.tenantId,
        userId: user.userId,
        role: user.role,
      });

      return sendJsonSafe(reply, me);
    });
  });
}
