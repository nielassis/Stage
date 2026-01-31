import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.url(),
  CORS_ORIGINS: z.string(),
  JWT_SECRET: z.string(),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
});

export const env = envSchema.parse(process.env);
