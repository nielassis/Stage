import { FastifyReply, FastifyRequest } from 'fastify';
import { randomUUID } from 'crypto';

export async function requestId(req: FastifyRequest, res: FastifyReply) {
  const header = req.headers['x-request-id'];
  const id = Array.isArray(header)
    ? header[0]
    : header
      ? String(header)
      : randomUUID();

  req.id = id;
  res.header('x-request-id', id);
}
