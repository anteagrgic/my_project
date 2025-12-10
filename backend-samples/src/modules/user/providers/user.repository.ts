import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { AbstractRepository } from 'src/common/abstract/abstract.repository';
import { User, UserTable } from 'src/common/drizzle/schema';
import { PaginationParams } from 'src/common/pagination/pagination.params';
import {
  DRIZZLE_ORM,
  DrizzleAsyncProvider,
} from 'src/common/providers/drizzle.provider';

import { IUser } from '../interfaces/user.interface';
import { IUserRepository } from '../interfaces/user.repository.interface';

@Injectable()
export class UserRepository
  extends AbstractRepository<User>
  implements IUserRepository
{
  constructor(
    @Inject(DRIZZLE_ORM) protected readonly db: DrizzleAsyncProvider,
  ) {
    super(db, UserTable);
  }

  async findById(id: string): Promise<IUser> {
    const results = await this.db
      .select()
      .from(this.table)
      .where(eq(this.table.id, id))
      .limit(1);
    return results[0];
  }

  async findByPhone(phone: string): Promise<IUser> {
    const results = await this.db
      .select()
      .from(this.table)
      .where(eq(this.table.phone, phone))
      .limit(1);
    return results[0];
  }

  async findManyAndCount({
    skip,
    limit,
  }: PaginationParams): Promise<[IUser[], number]> {
    const count = await this.db.$count(this.table);
    const items = await this.db
      .select()
      .from(this.table)
      .limit(limit)
      .offset(skip);

    return [items, count];
  }

  async existsById(id: string): Promise<boolean> {
    const [first] = await this.db
      .select({ id: this.table.id })
      .from(this.table)
      .where(eq(this.table.id, id))
      .limit(1);

    return !!first;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const results = await this.db
      .select()
      .from(this.table)
      .where(eq(this.table.email, email))
      .limit(1);
    return results[0] || null;
  }
}
