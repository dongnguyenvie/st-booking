import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // Fallback prevents PrismaConfigEnvError during `prisma generate` (build/CI)
    // where DATABASE_URL is not available. Migrate deploy at runtime uses the real URL.
    url: process.env.DATABASE_URL ?? 'postgresql://localhost:5432/placeholder',
  },
  migrations: {
    seed: 'ts-node -r tsconfig-paths/register prisma/seed.ts',
  },
});
