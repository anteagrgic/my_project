import { INestApplication } from '@nestjs/common';
import { getTableName, sql } from 'drizzle-orm';
import * as schema from 'src/common/drizzle/schema';
import { DRIZZLE_ORM, DrizzleAsyncProvider } from 'src/common/providers/drizzle.provider';

/**
 * Deletes all data in the databases.
 * @param app - Nest application
 */
export async function deleteData(app: INestApplication): Promise<void> {
  await Promise.all([deleteRelationalData(app)]);
}

/**
 * Delete all data in the relational database.
 * @param app
 */
async function deleteRelationalData(app: INestApplication): Promise<void> {
  const db = app.get<DrizzleAsyncProvider>(DRIZZLE_ORM);

  // Get all table names from schema
  const tableNames = Object.values(schema)
    .filter((table) => table && typeof table === 'object' && 'dbName' in table)
    .map((table) => `"${getTableName(table)}"`)
    .join(', ');

  if (tableNames) {
    await db.execute(sql.raw(`TRUNCATE ${tableNames} RESTART IDENTITY CASCADE;`));
  }
}
