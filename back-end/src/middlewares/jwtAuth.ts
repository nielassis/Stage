import { verify } from 'jsonwebtoken';
import { FastifyRequest } from 'fastify';
import { AppError } from '../utils/error';
import { AuthUserPayload } from '../types/auth';
import { env } from '../config/env';

export async function jwtAuth(req: FastifyRequest) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError('Unauthorized', 401);
  }

  const token = authHeader.slice(7);

  try {
    const decoded = verify(token, env.JWT_SECRET) as AuthUserPayload;

    req.authUserPayload = {
      userId: decoded.userId,
      tenantId: decoded.tenantId,
      role: decoded.role,
    };
  } catch (err) {
    req.log.error({ err }, 'JWT verification failed');
    throw new AppError('Unauthorized', 401);
  }
}
