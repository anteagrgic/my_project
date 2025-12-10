import { ApiProperty } from '@nestjs/swagger';

import { PaginationModel } from 'src/common/pagination/paginaton.model';

import { UserResponse } from './user.response';

export class PaginatedUserResponse extends PaginationModel<UserResponse> {
  @ApiProperty({ type: [UserResponse] })
  items: UserResponse[];
}