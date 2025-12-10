import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

export const DRIZZLE_ORM = 'DRIZZLE_ORM';

export interface DrizzleConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

@Global()
@Module({})
export class DrizzleModule {
  static forRootAsync(options: {
    useFactory: (...args: any[]) => Promise<DrizzleConfig> | DrizzleConfig;
    inject?: any[];
    schema?: any;
  }): DynamicModule {
    const drizzleProvider: Provider = {
      provide: DRIZZLE_ORM,
      useFactory: async (...args: any[]): Promise<NodePgDatabase> => {
        const config = await options.useFactory(...args);
        const pool = new Pool({
          host: config.host,
          port: config.port,
          user: config.user,
          password: config.password,
          database: config.database,
        });
        return drizzle(pool, { schema: options.schema });
      },
      inject: options.inject || [],
    };

    return {
      module: DrizzleModule,
      providers: [drizzleProvider],
      exports: [drizzleProvider],
      global: true,
    };
  }
}

export type DrizzleAsyncProvider = NodePgDatabase<any>;
