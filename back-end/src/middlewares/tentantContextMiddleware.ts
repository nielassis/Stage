import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../config/prisma';

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
    return reply.status(403).send({ message: 'Tenant not found' });
  }

  if (req.params?.tenantId && req.params.tenantId !== user.tenantId) {
    return reply.status(403).send({
      message: 'Cross-tenant access is not allowed',
    });
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
