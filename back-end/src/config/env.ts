import { z } from 'zod';
import 'dotenv/config';

const envSchema = z.object({
  DATABASE_URL: z.url(),
  CORS_ORIGINS: z.string(),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  RATE_LIMIT_DEFAULT: z.coerce.number().default(100),
  CLIENT_URL: z.url().optional(),
  PORT: z.coerce.number().default(3000),
  JWT_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);
