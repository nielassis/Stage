import fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import rateLimit from '@fastify/rate-limit';

import { requestId } from './middlewares/requestId';

import { env } from './config/env';
import fastifyCors from '@fastify/cors';

import { tenantContextMiddleware } from './middlewares/tentantContextMiddleware';
import { AppError } from './utils/error';
import authRoutes from './modules/auth/auth.rotes';

const app = fastify({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  },
  bodyLimit: 1 * 1024 * 1024,
  maxParamLength: 200,
  trustProxy: true,
  routerOptions: {
    maxParamLength: 200,
  },
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
          bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        },
      },
    },
  });
  app.register(swaggerUi, { routePrefix: '/docs' });
}

app.register(fastifyCors, {
  origin: env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
});

app.register(
  async (api) => {
    // 🔓 Rotas públicas
    app.register(authRoutes, { prefix: '/auth' });

    // 🔒 Rotas protegidas
    api.register(async (privateApi) => {
      privateApi.addHook('preHandler', tenantContextMiddleware);

      privateApi.register(rateLimit, {
        max: env.RATE_LIMIT_DEFAULT,
        timeWindow: '1 minute',
        keyGenerator: (req) =>
          (req.tenantContext?.tenantId ??
            req.authUserPayload?.userId ??
            req.ip) as string,
      });
    });
  },
  { prefix: '/api' },
);

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({ error: error.message });
  }

  app.log.error(error);
  const statusCode = (error as any).statusCode ?? 500;

  reply.status(statusCode).send({
    error: (error as any).message ?? 'Internal Server Error',
  });
});

export default app;
