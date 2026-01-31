import { FastifyInstance } from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { env } from './env';

export function registerSecurityPlugins(app: FastifyInstance) {
  app.register(jwt, {
    secret: env.JWT_SECRET || 'STDN!@L0612!@#',
  });

  app.register(helmet, {
    global: true,
  });

  app.register(cors, {
    origin: env.CORS_ORIGINS.split(',').map((o) => o.trim()),
    credentials: true,
  });
}
