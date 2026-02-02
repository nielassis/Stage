import fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import rateLimit from '@fastify/rate-limit';
import fastifyCors from '@fastify/cors';

import { requestId } from './middlewares/requestId';
import { tenantContextMiddleware } from './middlewares/tentantContextMiddleware';
import { jwtAuth } from './middlewares/jwtAuth';

import { env } from './config/env';
import { AppError } from './utils/error';

import authRoutes from './modules/auth/auth.rotes';
import { tenancyRoutes } from './modules/tenancy/tenancy.routes';
import { usersRoutes } from './modules/users/users.routes';
import { serviceOrderRoutes } from './modules/service-order/service-order.routes';
import { osStagesRoutes } from './modules/service-order-stage/service-order-stage.routes';
import { reportsRoutes } from './modules/reports/reports.routes';
import { customersRoutes } from './modules/customers/customer.routes';

const app = fastify({
  logger: true,
  bodyLimit: 1 * 1024 * 1024,
  trustProxy: true,
});

app.addHook('onRequest', requestId);

if (env.NODE_ENV !== 'production') {
  app.register(swagger, {
    openapi: {
      info: {
        title: 'Stage API',
        description: 'Docs for Stage API',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
  });

  app.register(swaggerUi, { routePrefix: '/docs' });
}

app.register(fastifyCors, {
  origin: env.CLIENT_URL || true,
  credentials: true,
});

app.register(
  async (api) => {
    // 🔓 públicas
    api.register(authRoutes, { prefix: '/auth' });

    // 🔒 protegidas
    api.register(async (privateApi) => {
      privateApi.addHook('preHandler', jwtAuth);
      privateApi.addHook('preHandler', tenantContextMiddleware);

      privateApi.register(rateLimit, {
        max: env.RATE_LIMIT_DEFAULT,
        timeWindow: '1 minute',
        keyGenerator: (req) =>
          (req.tenantContext?.tenantId ??
            req.authUserPayload?.userId ??
            req.ip) as string,
      });

      privateApi.register(tenancyRoutes);
      privateApi.register(usersRoutes);
      privateApi.register(serviceOrderRoutes);
      privateApi.register(osStagesRoutes);
      privateApi.register(reportsRoutes);
      privateApi.register(customersRoutes);
    });
  },
  { prefix: '/api' },
);

app.setErrorHandler((error, _req, reply) => {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({ error: error.message });
  }

  app.log.error(error);

  reply.status(500).send({
    error: 'Internal Server Error',
  });
});

export default app;
