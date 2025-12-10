import { Injectable } from '@nestjs/common';

import { NodeConfig, ProjectConfig } from 'src/common/config/env.validation';
import { Environment } from 'src/common/constants/environment.enum';
import { PropertyPilotConflictException } from 'src/common/exceptions/custom.exception';
import { ExceptionName } from 'src/common/exceptions/custom.exception.enum';
import { ICustomExceptionInfo } from 'src/common/exceptions/exception-info.interface';
import { exceptionMetadata } from 'src/common/exceptions/metadata.exception';

import { IHealthCheckService } from '../../common/interfaces/health-check.interface';
import { HealthCheckResponse } from '../../common/responses/health-check.response';

@Injectable()
export class AppService implements IHealthCheckService {
  constructor(
    private readonly project: ProjectConfig,
    private readonly nodeConfig: NodeConfig,
  ) {}

  /**
   * Returns basic API data.
   */
  getHealthCheck(): HealthCheckResponse {
    return new HealthCheckResponse(
      this.project.NAME,
      this.project.DESCRIPTION,
      this.project.VERSION,
    );
  }

  /**
   * Exception metadata.
   * @returns Metadata for project-specific exceptions
   */
  getExceptionMetadata(): Record<ExceptionName, ICustomExceptionInfo> {
    if (this.nodeConfig.ENV !== Environment.Development) {
      throw new PropertyPilotConflictException(
        'This endpoint is available only in development environment',
      );
    }

    return exceptionMetadata;
  }
}
