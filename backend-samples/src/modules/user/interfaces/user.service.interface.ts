import { PaginationParams } from 'src/common/pagination/pagination.params';
import { PaginationModel } from 'src/common/pagination/paginaton.model';

import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { IUser } from './user.interface';

export const UserServiceToken = Symbol('UserServiceToken');

export interface IUserService {
  /**
   * Create a new user.
   * @param data - user data
   * @returns User resource
   */
  create(data: CreateUserDto): Promise<IUser>;

  /**
   * List all users.
   * @param params - pagination parameters: skip, limit
   * @returns Paginated list of user entities
   */
  listAll(params: PaginationParams): Promise<PaginationModel<IUser>>;

  /**
   * Find a user by ID.
   * @param id - ID of the user
   * @returns User resource
   */
  findOne(id: string): Promise<IUser>;

  /**
   * Check if a user exists by ID.
   * @param id - ID of the user
   * @throws AthesNotFoundException if the user does not exist
   */
  checkExistanceOrFail(id: string): Promise<void>;

  /**
   * Update a user.
   * @param id - ID of the user
   * @param data - user data
   * @returns User resource
   */
  update(id: string, data: UpdateUserDto): Promise<IUser>;

  /**
   * Delete a user by ID.
   * @param id - ID of the user
   */
  remove(id: string): Promise<void>;

  /**
   * Find a user by email address.
   * @param email - Email of the user
   * @returns User resource or null if not found
   */
  findByEmail(email: string): Promise<IUser | null>;

  /**
   * Find a user by phone number.
   * @param phone - Phone number of the user
   * @returns User resource or null if not found
   */
  findByPhone(phone: string): Promise<IUser | null>;
}
