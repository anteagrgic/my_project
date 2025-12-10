import {
  Inject,
  Injectable,
  LoggerService,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as requestIp from 'request-ip';
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const startAt = process.hrtime();
    const { method, originalUrl } = request;

    const ip = requestIp.getClientIp(request);

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      const diff = process.hrtime(startAt);
      const time = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
      const buildNumber = request.headers['x-build-number'] ?? 'Unknown';
      const platform = request.headers['x-platform'] ?? 'Unknown';

      // Skip logging of metrics endpoint
      if (!originalUrl.endsWith('metrics')) {
        this.logger.log(
          `[${method} ${originalUrl}] - Status: ${statusCode} | Time: ${time}ms | Content Length: ${contentLength} | IP: ${ip} | Build: ${buildNumber} | Platform: ${platform}`,
        );
      }
    });

    next();
  }
}
