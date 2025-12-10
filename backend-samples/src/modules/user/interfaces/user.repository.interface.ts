import { IRepository } from 'src/common/interfaces/repository.interface';
import { PaginationParams } from 'src/common/pagination/pagination.params';

import { ICreateUser, IUser } from './user.interface';

export const UserRepositoryToken = Symbol('UserRepository');

export interface IUserRepository extends IRepository<ICreateUser, IUser> {
  /**
   * Find User by Id
   * @param id - unique id of the User
   */
  findById(id: string): Promise<IUser>;

  /**
   * Find User by phone number
   * @param phone - user's phone number
   */
  findByPhone(phone: string): Promise<IUser>;

  /**
   * Find many users and count all
   * @param params - pagination parameters skip and limit (take)
   */
  findManyAndCount(params: PaginationParams): Promise<[IUser[], number]>;

  /**
   * Check whether the record exists in the database
   * @param id - unique id of users
   */
  existsById(id: string): Promise<boolean>;

  /**
   * Find user by email
   * @param email - user's email
   */
  findByEmail(email: string): Promise<IUser | null>;
}
