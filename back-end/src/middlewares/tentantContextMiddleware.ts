import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/error';

export async function tenantContextMiddleware(
  req: FastifyRequest<{ Params?: { tenantId?: string } }>,
  reply: FastifyReply,
) {
  const authUser = req.authUserPayload;

  if (!authUser) {
    return reply.status(401).send({ message: 'Not authenticated' });
  }

  const user = await prisma.user.findUnique({
    where: { id: authUser.userId },
    select: {
      id: true,
      tenantId: true,
      role: true,
    },
  });

  if (!user || !user.tenantId) {
    throw new AppError('User not found or not associated with a tenant', 404);
  }

  if (req.params?.tenantId && req.params.tenantId !== user.tenantId) {
    throw new AppError('Cross-tenant access is not allowed', 403);
  }

  req.authUserPayload = {
    userId: user.id,
    tenantId: user.tenantId,
    role: user.role,
  };

  req.tenantContext = {
    tenantId: user.tenantId,
    role: user.role,
  };
}
