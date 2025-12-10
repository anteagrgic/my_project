import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import { Token } from 'src/common/drizzle/schema';

export interface ICreateToken extends InferInsertModel<Token> {}
export interface IToken extends InferSelectModel<Token> {}

export interface IJwtTokenData {
  subject: string;
  expiration: number;
}

export interface IJwtTokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface IJWTTokenGeneratePayload {
  id: string;
  firebaseToken?: string;
}
