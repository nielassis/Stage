import { FastifyInstance } from 'fastify';
import { jwtAuth } from '../../middlewares/jwtAuth';
import { AuthUserPayload } from '../../types/auth';
import { sendJsonSafe } from '../../utils/sendJsonSafe';

import {
  customersGrowthReport,
  osStatusReport,
  osFinancialReport,
  osListReport,
  stageStatusReport,
  stageTimelineReport,
  userProductivityReport,
  myOsSummaryReport,
} from './reports.service';

import { DateRangeQuery } from './types';
import { dateRangeQueryJsonSchema } from './schemas/dateRangeQuery.schema';

export async function reportsRoutes(app: FastifyInstance) {
  app.register(async (panel) => {
    panel.addHook('preHandler', jwtAuth);

    panel.get<{ Querystring: DateRangeQuery }>(
      '/reports/customers/growth',
      {
        schema: {
          querystring: dateRangeQueryJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;

        const result = await customersGrowthReport(
          {
            tenantId: user.tenantId,
            userId: user.userId,
            role: user.role,
          },
          request.query,
        );

        return sendJsonSafe(reply, result);
      },
    );

    panel.get<{ Querystring: DateRangeQuery }>(
      '/reports/os/status',
      {
        schema: {
          querystring: dateRangeQueryJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;

        const result = await osStatusReport(
          {
            tenantId: user.tenantId,
            userId: user.userId,
            role: user.role,
          },
          request.query,
        );

        return sendJsonSafe(reply, result);
      },
    );

    panel.get<{ Querystring: DateRangeQuery }>(
      '/reports/os/financial',
      {
        schema: {
          querystring: dateRangeQueryJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;

        const result = await osFinancialReport(
          {
            tenantId: user.tenantId,
            userId: user.userId,
            role: user.role,
          },
          request.query,
        );

        return sendJsonSafe(reply, result);
      },
    );

    panel.get<{}>('/reports/os/list', {}, async (request, reply) => {
      const user = request.authUserPayload as AuthUserPayload;

      const page = await osListReport({
        tenantId: user.tenantId,
        userId: user.userId,
        role: user.role,
      });

      return sendJsonSafe(reply, page);
    });

    panel.get<{ Querystring: DateRangeQuery }>(
      '/reports/os-stages/status',
      {
        schema: {
          querystring: dateRangeQueryJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;

        const result = await stageStatusReport(
          {
            tenantId: user.tenantId,
            userId: user.userId,
            role: user.role,
          },
          request.query,
        );

        return sendJsonSafe(reply, result);
      },
    );

    panel.get<{}>('/reports/os-stages/timeline', {}, async (request, reply) => {
      const user = request.authUserPayload as AuthUserPayload;

      const result = await stageTimelineReport({
        tenantId: user.tenantId,
        userId: user.userId,
        role: user.role,
      });

      return sendJsonSafe(reply, result);
    });

    panel.get<{ Querystring: DateRangeQuery }>(
      '/reports/users/productivity',
      {
        schema: {
          querystring: dateRangeQueryJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;

        const result = await userProductivityReport(
          {
            tenantId: user.tenantId,
            userId: user.userId,
            role: user.role,
          },
          request.query,
        );

        return sendJsonSafe(reply, result);
      },
    );

    panel.get<{ Querystring: DateRangeQuery }>(
      '/reports/my-os/summary',
      {
        schema: {
          querystring: dateRangeQueryJsonSchema,
        },
      },
      async (request, reply) => {
        const user = request.authUserPayload as AuthUserPayload;

        const result = await myOsSummaryReport(
          {
            tenantId: user.tenantId,
            userId: user.userId,
            role: user.role,
          },
          request.query,
        );

        return sendJsonSafe(reply, result);
      },
    );
  });
}
