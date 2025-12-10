import { Module } from '@nestjs/common';

import { UserRepositoryToken } from './interfaces/user.repository.interface';
import { UserServiceToken } from './interfaces/user.service.interface';
import { UserRepository } from './providers/user.repository';
import { UserService } from './providers/user.service';
import { UserController } from './user.controller';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    {
      provide: UserRepositoryToken,
      useClass: UserRepository,
    },
    {
      provide: UserServiceToken,
      useClass: UserService,
    },
  ],
  exports: [UserServiceToken],
})
export class UserModule {}

