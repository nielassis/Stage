import { FastifyInstance } from 'fastify';

import { loginDTO } from './types';
import { login } from './auth.service';
import { authUserJsonSchema } from './schemas/authUser.schema';
import { jwtAuth } from '../../middlewares/jwtAuth';

export default async function authRoutes(app: FastifyInstance) {
  app.post<{ Body: loginDTO }>(
    '/login',
    { schema: { body: authUserJsonSchema } },
    async (request, reply) => {
      const result = await login(request.body);
      reply.status(200).send(result);
    },
  );

  app.get('/me', { preHandler: jwtAuth }, async (request, reply) => {
    reply.send(request.authUserPayload);
  });
}
