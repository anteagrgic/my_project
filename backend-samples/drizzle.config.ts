import * as dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config();

export default defineConfig({
  schema: './src/common/drizzle/schema.ts',
  out: './src/common/drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.POSTGRES_HOST!,
    port: Number(process.env.POSTGRES_PORT!),
    user: process.env.POSTGRES_USERNAME!,
    password: process.env.POSTGRES_PASSWORD!,
    database: process.env.POSTGRES_DBNAME!,
    ssl: false,
  },
});
