import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypedConfigModule, dotenvLoader } from 'nest-typed-config';
import { WinstonModule } from 'nest-winston';

import { DrizzleOrmConfig, RootConfig } from 'src/common/config/env.validation';
import * as schema from 'src/common/drizzle/schema';
import { GlobalExceptionFilter } from 'src/common/exceptions/exception.filter';
import { DrizzleModule } from 'src/common/providers/drizzle.provider';
import { WinstonOptions } from 'src/common/providers/winston.provider';
import { AppModule } from 'src/modules/app/app.module';
import { EmailServiceProviderToken } from 'src/modules/auth/interfaces/email-provider/email-provider.service.interface.ts';

/**
 * Creates a testing module that mimics the whole app.
 *
 * Mocks modules:
 *   - TypedConfigModule: to use a test environment file
 *   - DrizzleModule: to use a test database
 * Mocks providers:
 *   - EmailProviderToken: to mock the email provider
 *   - FirebaseService: to mock the firebase service
 *   - GlobalExceptionFilter: to mock the exception filter
 *
 * @returns Nest application and testing module
 */
export async function getTestingModule(): Promise<{
  app: INestApplication;
  moduleFixture: TestingModule;
}> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      AppModule,

      TypedConfigModule.forRoot({
        schema: RootConfig,
        load: dotenvLoader({
          separator: '_',
          envFilePath: ['.env.test'],
          ignoreEnvVars: true,
        }),
      }),
      DrizzleModule.forRootAsync({
        inject: [DrizzleOrmConfig],
        useFactory(config: DrizzleOrmConfig) {
          return {
            host: config.HOST,
            port: config.PORT,
            user: config.USERNAME,
            password: config.PASSWORD,
            database: config.DBNAME,
          };
        },
        schema,
      }),
      WinstonModule.forRootAsync({
        useClass: WinstonOptions,
      }),
    ],
  })
    .overrideProvider(EmailServiceProviderToken)
    .useValue({
      sendEmail: jest.fn(),
    })
    .overrideFilter(GlobalExceptionFilter)
    .useValue({
      catch: jest.fn(),
    })
    .compile();
  const app = moduleFixture.createNestApplication();
  await app.init();

  return { app, moduleFixture };
}
