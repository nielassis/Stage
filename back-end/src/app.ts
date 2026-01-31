import fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import { requestId } from './middlewares/requestId';
import { registerSecurityPlugins } from './config/security';
import { env } from './config/env';

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
registerSecurityPlugins(app);

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
