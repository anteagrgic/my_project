/* eslint-disable @typescript-eslint/ban-types */
import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

import { PaginationMetaResponse } from './pagination-meta.response';

export const ApiPaginatedResponse = <TModel extends Type>(
  model: TModel,
): (<TFunction extends Function, Y>(
  target: object | TFunction,
  propertyKey?: string | symbol,
  descriptor?: TypedPropertyDescriptor<Y>,
) => void) => {
  return applyDecorators(
    ApiExtraModels(PaginationMetaResponse),
    ApiOkResponse({
      description: 'Paginated list of items',
      schema: {
        allOf: [
          {
            properties: {
              meta: { $ref: getSchemaPath(PaginationMetaResponse) },
            },
          },
          {
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
