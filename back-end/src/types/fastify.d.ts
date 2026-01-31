import 'fastify';
import { AuthUserPayload, TenantContextPayload } from './auth';

declare module 'fastify' {
  interface FastifyRequest {
    tenantContext?: TenantContextPayload;
    authUserPayload?: AuthUserPayload;
  }
}
