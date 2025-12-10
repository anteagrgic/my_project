import { ApiProperty } from '@nestjs/swagger';

export class HealthCheckResponse {
  @ApiProperty({
    description: 'Name of the API',
    example: 'Base API',
  })
  name: string;

  @ApiProperty({
    description: 'Description of the API',
    example: 'Base project API',
  })
  description: string;

  @ApiProperty({
    description: 'Version of the API',
    example: '1.0.0',
  })
  version: string;

  constructor(name: string, description: string, version: string) {
    this.name = name;
    this.description = description;
    this.version = version;
  }
}
