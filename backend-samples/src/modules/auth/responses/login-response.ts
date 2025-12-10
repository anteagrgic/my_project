import { IJwtTokenPair } from '../interfaces/jwt-token/token.interface';

export class LoginResponse implements IJwtTokenPair {
  accessToken: string;
  refreshToken: string;
  emailIsVerified: boolean;
}
