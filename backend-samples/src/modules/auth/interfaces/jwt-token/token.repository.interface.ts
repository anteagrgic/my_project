import { IRepository } from 'src/common/interfaces/repository.interface';

import { ICreateToken, IToken } from './token.interface';

export const TokenRepositoryToken = Symbol('TokenRepositoryToken');

export interface ITokenRepository extends IRepository<ICreateToken, IToken> {
  /**
   * Get all tokens for a specific user
   * @param userId - unique id of the User
   */
  getTokensByUserId(userId: string): Promise<IToken[]>;

  /**
   * Create a new token
   * @param data - token data
   */
  createToken(data: ICreateToken): Promise<IToken>;

  /**
   * Delete a token by its ID
   * @param id - unique id of the Token
   */
  deleteTokenById(id: string): Promise<IToken>;

  /**
   * Get a token by its refresh token
   * @param refreshToken - refresh token string
   */
  getTokenByRefreshToken(refreshToken: string): Promise<IToken | null>;

  /**
   * Delete all tokens for a specific user
   * @param userId - unique id of the User
   */
  deleteTokensByUserId(userId: string): Promise<IToken[]>;

  /**
   * Delete a token by user ID and Firebase token
   * @param userId - unique id of the User
   * @param firebaseToken - Firebase token string
   */
  deleteByUserIdAndFirebaseToken(
    userId: string,
    firebaseToken: string,
  ): Promise<IToken[]>;
}
