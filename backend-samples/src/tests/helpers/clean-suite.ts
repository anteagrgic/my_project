import { INestApplication } from '@nestjs/common';

/**
 * Cleans the test module by closing connections to the database.
 * @param app
 */
export async function cleanTestModule(app: INestApplication): Promise<void> {
  await app.close();
}
