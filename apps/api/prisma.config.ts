import path from 'node:path';
import { defineConfig, env } from 'prisma/config';
import * as dotenv from 'dotenv';

// Load .env from current directory (apps/api/.env)
dotenv.config({ path: path.join(__dirname, '.env') });

export default defineConfig({
  schema: path.join(__dirname, 'prisma', 'schema.prisma'),
  datasource: {
    url: env('DATABASE_URL'),
  },
  migrations: {
    seed: 'ts-node ./prisma/seed.ts',
  },
});
