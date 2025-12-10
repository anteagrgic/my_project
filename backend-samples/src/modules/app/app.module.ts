import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypedConfigModule, dotenvLoader } from 'nest-typed-config';
import { WinstonModule } from 'nest-winston';

import { GlobalExceptionFilter } from 'src/common/exceptions/exception.filter';
import { LoggerMiddleware } from 'src/common/middlewares/logger.middleware';
import { DrizzleModule } from 'src/common/providers/drizzle.provider';
import { WinstonOptions } from 'src/common/providers/winston.provider';

import {
  DrizzleOrmConfig,
  RootConfig,
} from '../../common/config/env.validation';
import * as schema from '../../common/drizzle/schema';
import { AuthModule } from '../auth/auth.module';
import { AuthenticationGuard } from '../auth/guards/authentication.guard';
import { UserModule } from '../user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Environment variables
    TypedConfigModule.forRoot({
      schema: RootConfig,
      load: dotenvLoader({ separator: '_' }),
      isGlobal: true,
    }),

    // Logging
    WinstonModule.forRootAsync({
      useClass: WinstonOptions,
    }),

    // Drizzle ORM
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

    EventEmitterModule.forRoot(),

    // Modules
    UserModule,
    AuthModule,
  ],

  controllers: [AppController],
  providers: [
    AppService,

    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(LoggerMiddleware)
      .exclude('/')
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
