import { Inject } from '@nestjs/common';

import { PropertyPilotNotFoundException } from 'src/common/exceptions/custom.exception';
import { PaginationParams } from 'src/common/pagination/pagination.params';
import { PaginationModel } from 'src/common/pagination/paginaton.model';

import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { IUser } from '../interfaces/user.interface';
import {
  IUserRepository,
  UserRepositoryToken,
} from '../interfaces/user.repository.interface';
import { IUserService } from '../interfaces/user.service.interface';

export class UserService implements IUserService {
  constructor(
    @Inject(UserRepositoryToken)
    private readonly userRepository: IUserRepository,
  ) {}

  async create(data: CreateUserDto): Promise<IUser> {
    const user = await this.userRepository.create(data);
    return user;
  }

  async listAll(params: PaginationParams): Promise<PaginationModel<IUser>> {
    const [users, total] = await this.userRepository.findManyAndCount(params);
    return new PaginationModel<IUser>(users, params, total);
  }

  async findOne(id: string): Promise<IUser> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new PropertyPilotNotFoundException('User not found');
    }
    return user;
  }

  async checkExistanceOrFail(id: string): Promise<void> {
    const exist = await this.userRepository.existsById(id);
    if (!exist) {
      throw new PropertyPilotNotFoundException('User not found');
    }
  }

  async update(id: string, data: UpdateUserDto): Promise<IUser> {
    const user = await this.findOne(id);
    Object.assign(user, data);
    return this.userRepository.update(id, user);
  }

  async remove(id: string): Promise<void> {
    await this.checkExistanceOrFail(id);
    await this.userRepository.delete(id);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.userRepository.findByEmail(email);
  }

  async findByPhone(phone: string): Promise<IUser | null> {
    return this.userRepository.findByPhone(phone);
  }
}
