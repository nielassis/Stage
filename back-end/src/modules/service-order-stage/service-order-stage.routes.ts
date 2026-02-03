import { FastifyInstance } from 'fastify';
import { jwtAuth } from '../../middlewares/jwtAuth';
import { AuthUserPayload } from '../../types/auth';
import { sendJsonSafe } from '../../utils/sendJsonSafe';

import {
  createOsStage,
  listStages,
  requestStageForApproval,
  approvalStage,
  rejectStage,
  updateStage,
  deleteStage,
  getStageById,
} from './service-order-stage.service';
import { osStageParamsJsonSchema } from './schemas/osStageParams.schema';
import { createOsStageBodyJsonSchema } from './schemas/createOsStage.schema';
import { rejectStageBodyJsonSchema } from './schemas/rejectOsStage.schema';
import { updateOsStageBodyJsonSchema } from './schemas/updateOsStage.schema';
import {
  CreateOsStageDTO,
  GetOsStageDTO,
  RejectStageDTO,
  UpdateStageDTO,
} from './types';

export async function osStagesRoutes(app: FastifyInstance) {
  app.register(async (panel) => {
    panel.addHook('preHandler', jwtAuth);

    panel.post<{ Body: CreateOsStageDTO; Params: GetOsStageDTO }>(
      '/os/:osId/stages',
      {
        schema: {
          params: osStageParamsJsonSchema,
          body: createOsStageBodyJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;

        const stage = await createOsStage(
          {
            tenantId: user.tenantId,
            userId: user.userId,
            role: user.role,
          },
          {
            ...request.body,
            osId: request.params.osId,
          },
        );

        return sendJsonSafe(reply, stage);
      },
    );

    panel.get<{ Params: GetOsStageDTO }>(
      '/os/:osId/stages/:id',
      {
        schema: {
          params: osStageParamsJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;

        const stages = await getStageById(
          {
            tenantId: user.tenantId,
            userId: user.userId,
            role: user.role,
          },
          {
            osId: request.params.osId,
            id: request.params.id,
          },
        );

        return sendJsonSafe(reply, stages);
      },
    );

    panel.get<{ Params: GetOsStageDTO }>(
      '/os/:osId/stages',
      {
        schema: {
          params: osStageParamsJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;

        const stages = await listStages(
          {
            tenantId: user.tenantId,
            userId: user.userId,
            role: user.role,
          },
          {
            osId: request.params.osId,
            id: '',
          },
        );

        return sendJsonSafe(reply, stages);
      },
    );

    panel.post<{ Params: GetOsStageDTO }>(
      '/os/:osId/stages/:id/request-approval',
      {
        schema: {
          params: osStageParamsJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;

        const stage = await requestStageForApproval(
          {
            tenantId: user.tenantId,
            userId: user.userId,
            role: user.role,
          },
          request.params,
        );

        return sendJsonSafe(reply, stage);
      },
    );

    panel.post<{ Params: GetOsStageDTO }>(
      '/os/:osId/stages/:id/approve',
      {
        schema: {
          params: osStageParamsJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;

        const stage = await approvalStage(
          {
            tenantId: user.tenantId,
            userId: user.userId,
            role: user.role,
          },
          request.params,
        );

        return sendJsonSafe(reply, stage);
      },
    );

    panel.post<{ Params: GetOsStageDTO; Body: RejectStageDTO }>(
      '/os/:osId/stages/:id/reject',
      {
        schema: {
          params: osStageParamsJsonSchema,
          body: rejectStageBodyJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;

        const stage = await rejectStage(
          {
            tenantId: user.tenantId,
            userId: user.userId,
            role: user.role,
          },
          request.params,
          request.body,
        );

        return sendJsonSafe(reply, stage);
      },
    );

    panel.put<{ Params: GetOsStageDTO; Body: UpdateStageDTO }>(
      '/os/:osId/stages/:id',
      {
        schema: {
          params: osStageParamsJsonSchema,
          body: updateOsStageBodyJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;

        const stage = await updateStage(
          {
            tenantId: user.tenantId,
            userId: user.userId,
            role: user.role,
          },
          request.body,
          request.params,
        );

        return sendJsonSafe(reply, stage);
      },
    );

    panel.delete<{ Params: GetOsStageDTO }>(
      '/os/:osId/stages/:id',
      {
        schema: {
          params: osStageParamsJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;

        const result = await deleteStage(
          {
            tenantId: user.tenantId,
            userId: user.userId,
            role: user.role,
          },
          request.params,
        );

        return sendJsonSafe(reply, result);
      },
    );
  });
}
