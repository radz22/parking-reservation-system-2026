import { defineConfig } from 'prisma/config';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  schema: 'prisma/schema',
  migrations: {
    seed: 'ts-node -P prisma/seed/tsconfig.seed.json prisma/seed/seed-exect.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
