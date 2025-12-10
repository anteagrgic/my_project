import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { UUIDParam } from 'src/common/dto/uuid.param';
import { PropertyPilotExceptionResponse } from 'src/common/exceptions/custom-exception.response';
import { PaginationParams } from 'src/common/pagination/pagination.params';

import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import {
  IUserService,
  UserServiceToken,
} from './interfaces/user.service.interface';
import { PaginatedUserResponse } from './responses/user.paginated.response';
import { UserResponse } from './responses/user.response';

@ApiTags('Users')
@ApiResponse({
  description: 'Non 2xx response',
  type: PropertyPilotExceptionResponse,
})
@Controller('users')
export class UserController {
  constructor(
    @Inject(UserServiceToken) private readonly userService: IUserService,
  ) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    description: 'User resource',
    type: UserResponse,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }

  @ApiOperation({ summary: 'List all users' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Paginated list of users',
    type: PaginatedUserResponse,
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  list(@Query() params: PaginationParams) {
    return this.userService.listAll(params);
  }

  @ApiOperation({ summary: 'Find a user by ID' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'User resource',
    type: UserResponse,
  })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  find(@Param() { id }: UUIDParam) {
    return this.userService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a user' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'User resource',
    type: UserResponse,
  })
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  update(@Param() { id }: UUIDParam, @Body() data: UpdateUserDto) {
    return this.userService.update(id, data);
  }

  @ApiOperation({ summary: 'Delete a user' })
  @ApiNoContentResponse({
    description: 'User deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param() { id }: UUIDParam) {
    return this.userService.remove(id);
  }
}
