import { OpenAPIObject } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { Request, Response } from 'express';

export function getScalarConfig(
  document: OpenAPIObject,
): (req: Request, res: Response) => void {
  return apiReference({
    spec: {
      content: document,
    },
    theme: 'deepSpace',
    metaData: {
      title: 'PropertyPilot API reference',
    },
    defaultHttpClient: {
      targetKey: 'node',
      clientKey: 'axios',
    },
  });
}
