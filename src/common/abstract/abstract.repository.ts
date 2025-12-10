import { Injectable } from '@nestjs/common';
import { InferInsertModel, InferSelectModel, eq } from 'drizzle-orm';
import { PgColumn, PgTable } from 'drizzle-orm/pg-core';

import { IRepository } from '../interfaces/repository.interface';
import { DrizzleAsyncProvider } from '../providers/drizzle.provider';

// Interface to ensure tables have an 'id' column
interface TableWithId extends PgTable {
  id: PgColumn;
}

@Injectable()
export abstract class AbstractRepository<
  T extends TableWithId,
  C = InferInsertModel<T>,
  R = InferSelectModel<T>,
> implements IRepository<C, R>
{
  constructor(
    protected readonly db: DrizzleAsyncProvider,
    protected readonly table: T,
  ) {}

  async create(data: C): Promise<R> {
    const result = await this.db
      .insert(this.table)
      .values(data as InferInsertModel<T>)
      .returning();
    return result[0] as R;
  }

  async update(id: string, data: Partial<C>): Promise<R | null> {
    const results = await this.db
      .update(this.table)
      .set(data as Partial<C>)
      .where(eq(this.table.id, id))
      .returning();
    return (results[0] as R) || null;
  }

  async delete(id: string): Promise<boolean> {
    const results = await this.db
      .delete(this.table)
      .where(eq(this.table.id, id))
      .returning();
    return !!(results as unknown as R[])[0];
  }
}
