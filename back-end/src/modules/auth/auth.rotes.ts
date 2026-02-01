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
      const { email, password } = request.body;

      const token = await login({ email, password });

      reply.status(200).send(token);
    },
  );
}
