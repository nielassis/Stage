import { FastifyInstance } from 'fastify';

import { sendJsonSafe } from '../../utils/sendJsonSafe';
import { AuthUserPayload } from '../../types/auth';

import { createTenant, getTenant, updateTenant } from './tenancy.service';

import { CreateTenantDTO, UpdateTenantDTO } from './types';
import { jwtAuth } from '../../middlewares/jwtAuth';
import { createTenantBodyJsonSchema } from './schemas/createTenant.schema';
import { updateTenantBodyJsonSchema } from './schemas/updateTenant.schema';

export async function tenancyRoutes(app: FastifyInstance) {
  app.register(async (panel) => {
    panel.addHook('preHandler', jwtAuth);

    panel.post<{ Body: CreateTenantDTO }>(
      '/tenancy',
      {
        schema: {
          body: createTenantBodyJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;

        const tenant = await createTenant(
          {
            userId: user.userId,
            tenantId: user.tenantId,
            role: user.role,
          },
          request.body,
        );

        return sendJsonSafe(reply, tenant);
      },
    );

    panel.get('/tenancy/me', async (request, reply) => {
      const user = request.authUserPayload as AuthUserPayload;

      const tenant = await getTenant({
        userId: user.userId,
        tenantId: user.tenantId,
        role: user.role,
      });

      return sendJsonSafe(reply, tenant);
    });

    panel.put<{ Body: UpdateTenantDTO }>(
      '/tenancy/me',
      {
        schema: {
          body: updateTenantBodyJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;

        const tenant = await updateTenant(
          {
            userId: user.userId,
            tenantId: user.tenantId,
            role: user.role,
          },
          request.body,
        );

        return sendJsonSafe(reply, tenant);
      },
    );
  });
}
