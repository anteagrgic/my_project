import { Inject, Injectable } from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';

import { AbstractRepository } from 'src/common/abstract/abstract.repository';
import {
  VerificationCode,
  VerificationCodeTable,
} from 'src/common/drizzle/schema';
import {
  DRIZZLE_ORM,
  DrizzleAsyncProvider,
} from 'src/common/providers/drizzle.provider';

import { IVerificationCode } from '../../interfaces/verification-code/verification-code.interface';
import { IVerificationCodeRepository } from '../../interfaces/verification-code/verification-code.repository';

@Injectable()
export class VerificationCodeRepository
  extends AbstractRepository<VerificationCode>
  implements IVerificationCodeRepository
{
  constructor(
    @Inject(DRIZZLE_ORM) protected readonly db: DrizzleAsyncProvider,
  ) {
    super(db, VerificationCodeTable);
  }

  async findByCode(code: string): Promise<IVerificationCode> {
    const result = await this.db
      .select()
      .from(this.table)
      .where(eq(this.table.code, code))
      .orderBy(desc(this.table.expiresAt))
      .limit(1);

    return result[0];
  }

  async findByUserAndCode(
    userId: string,
    code: string,
  ): Promise<IVerificationCode> {
    const result = await this.db
      .select()
      .from(this.table)
      .where(and(eq(this.table.userId, userId), eq(this.table.code, code)))
      .orderBy(desc(this.table.expiresAt))
      .limit(1);

    return result[0];
  }
}
