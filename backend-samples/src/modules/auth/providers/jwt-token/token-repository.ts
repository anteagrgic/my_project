import { Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';

import { AbstractRepository } from 'src/common/abstract/abstract.repository';
import { Token, TokenTable } from 'src/common/drizzle/schema';
import {
  DRIZZLE_ORM,
  DrizzleAsyncProvider,
} from 'src/common/providers/drizzle.provider';

import {
  ICreateToken,
  IToken,
} from '../../interfaces/jwt-token/token.interface';
import { ITokenRepository } from '../../interfaces/jwt-token/token.repository.interface';

@Injectable()
export class TokenRepository
  extends AbstractRepository<Token>
  implements ITokenRepository
{
  constructor(
    @Inject(DRIZZLE_ORM) protected readonly db: DrizzleAsyncProvider,
  ) {
    super(db, TokenTable);
  }

  async getTokensByUserId(userId: string): Promise<IToken[]> {
    const results = await this.db
      .select()
      .from(this.table)
      .where(eq(this.table.userId, userId));
    return results;
  }

  async createToken(data: ICreateToken): Promise<IToken> {
    const [token] = await this.db
      .insert(TokenTable)
      .values({
        id: crypto.randomUUID(),
        refreshToken: data.refreshToken,
        firebaseToken: data.firebaseToken ?? null,
        userId: data.userId,
        expiresAt: data.expiresAt,
      } as const)
      .returning();

    return token;
  }

  async deleteTokenById(id: string): Promise<IToken> {
    const result = await this.db
      .delete(TokenTable)
      .where(eq(TokenTable.id, id));
    return result;
  }

  async getTokenByRefreshToken(refreshToken: string): Promise<IToken | null> {
    const result = await this.db
      .select()
      .from(TokenTable)
      .where(eq(TokenTable.refreshToken, refreshToken))
      .limit(1);
    return result[0] || null;
  }

  async deleteTokensByUserId(userId: string): Promise<IToken[]> {
    const result = await this.db
      .delete(TokenTable)
      .where(eq(TokenTable.userId, userId));
    return result;
  }

  async deleteByUserIdAndFirebaseToken(
    userId: string,
    firebaseToken: string,
  ): Promise<IToken[]> {
    const result = await this.db
      .delete(TokenTable)
      .where(
        and(
          eq(TokenTable.userId, userId),
          eq(TokenTable.firebaseToken, firebaseToken),
        ),
      );
    return result;
  }
}
