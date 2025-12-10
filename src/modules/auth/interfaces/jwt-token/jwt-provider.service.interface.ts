import { RefreshTokenDto } from '../../dtos/refresh-token.dto';
import {
  IJWTTokenGeneratePayload,
  IJwtTokenData,
  IJwtTokenPair,
} from './token.interface';

export const JWTProviderToken = Symbol('JWTProviderToken');

export interface IJWTProvider {
  /**
   * Verify a JWT token and return its payload.
   * @param token - JWT token string
   */
  verify(token: string): IJwtTokenData;
  /**
   * Generate a pair of JWT tokens (access and refresh).
   * @param data - payload data for generating tokens
   */
  generatePair(data: IJWTTokenGeneratePayload): IJwtTokenPair;
  /**
   * Generate and save a pair of JWT tokens (access and refresh).
   * @param data - payload data for generating tokens
   */
  generatePairAndSave(data: IJWTTokenGeneratePayload): Promise<IJwtTokenPair>;
  /**
   * Delete all refresh tokens for a user.
   * @param userId - ID of the user
   */
  deleteRefreshTokensForUser(userId: string): Promise<void>;
  /**   * Delete a refresh token by user ID and Firebase token.
   * @param userId - ID of the user
   * @param firebaseToken - Firebase token to match
   */
  deleteByUserAndFirebaseToken(
    userId: string,
    firebaseToken: string,
  ): Promise<void>;
  /**
   * * Delete all tokens for a user.
   * @param userId - ID of the user
   */
  deleteByUser(userId: string): Promise<void>;
  /**
   * Refresh JWT tokens using a refresh token.
   * @param data - refresh token data
   */
  refreshToken(data: RefreshTokenDto): Promise<IJwtTokenPair>;
}
