import { ApiProperty } from '@nestjs/swagger';

import { IPageMeta } from './pagination-meta.interface';

export class PaginationMetaResponse {
  @ApiProperty({ description: 'Page number', example: 1 })
  readonly page: number;

  @ApiProperty({ description: 'Page size', example: 10 })
  readonly limit: number;

  @ApiProperty({ description: 'Total items without pagination', example: 100 })
  readonly itemCount: number;

  @ApiProperty({
    description: 'Total pages with current page size',
    example: 10,
  })
  readonly pageCount: number;

  @ApiProperty({
    description: 'Flag indicating if there is a previous page',
    example: true,
  })
  readonly hasPreviousPage: boolean;

  @ApiProperty({
    description: 'Flag indicating if there is a next page',
    example: true,
  })
  readonly hasNextPage: boolean;

  constructor({ params, count }: IPageMeta) {
    this.page = params.page;
    this.limit = params.limit;
    this.itemCount = count;
    this.pageCount = Math.ceil(this.itemCount / this.limit);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
