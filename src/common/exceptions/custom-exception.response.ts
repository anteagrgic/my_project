import { ApiProperty } from '@nestjs/swagger';

import { ExceptionOrigin } from '../constants/exception-origin.enum';
import {
  getAllCustomExceptionCodes,
  getAllCustomExceptionStatuses,
} from './metadata.exception';

export class PropertyPilotExceptionResponse {
  @ApiProperty({ example: 'PropertyPilot', enum: ExceptionOrigin })
  origin: ExceptionOrigin;

  @ApiProperty({
    examples: getAllCustomExceptionStatuses(),
    example: 404,
    description: 'HTTP-compatible status code',
  })
  status: number;

  @ApiProperty({
    examples: getAllCustomExceptionCodes(),
    example: 'PROJECT_ABBRV-001',
  })
  code: string;

  @ApiProperty({ description: 'Exception name', example: 'EXCEPTION-NAME' })
  exception: string;

  @ApiProperty({
    description: 'Human-readable error message',
    example: 'Human-readable message, safe for end users',
  })
  detail: string;
}
