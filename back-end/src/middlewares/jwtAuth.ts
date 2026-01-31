import { FastifyRequest, FastifyReply } from 'fastify';
import { verify } from 'jsonwebtoken';
import { env } from '../config/env';

import type { AuthUserPayload } from '../types/auth';
import { UserRole } from '../generated/prisma/enums';
import { AppError } from '../utils/error';

export async function jwtAuth(req: FastifyRequest, reply: FastifyReply) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Unauthorized', 401);
  }

  const token = authHeader.slice('Bearer '.length).trim();

  try {
    const decoded = verify(token, env.JWT_SECRET, {
      algorithms: ['HS256'],
      clockTolerance: 5,
    });

    if (typeof decoded !== 'object' || decoded === null) {
      throw new AppError('Unauthorized', 401);
    }

    const { userId, tenantId, role } = decoded as AuthUserPayload;

    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const allowedRoles = Object.values(UserRole) as string[];
    if (!role || !allowedRoles.includes(role)) {
      throw new AppError('Unauthorized', 401);
    }

    if (role !== UserRole.ADMIN && !tenantId) {
      throw new AppError('Unauthorized', 401);
    }

    if (!req.authUserPayload) {
      throw new AppError('Unauthorized', 401);
    }

    req.authUserPayload.user = {
      userId,
      tenantId: tenantId ?? null,
      role,
    } as any;
  } catch (err) {
    req.log.error({ err }, 'JWT verification failed');
    throw new AppError('Unauthorized', 401);
  }
}
