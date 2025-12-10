import { ApiProperty } from '@nestjs/swagger';

import { PaginationMetaResponse } from './pagination-meta.response';
import { PaginationParams } from './pagination.params';

export class PaginationModel<T> {
  @ApiProperty({ isArray: true })
  items: T[];

  @ApiProperty({ description: 'Pagination metadata' })
  meta: PaginationMetaResponse;

  constructor(items: T[], params: PaginationParams, count: number) {
    const meta = new PaginationMetaResponse({ params, count });
    this.items = items;
    this.meta = meta;
  }
}
