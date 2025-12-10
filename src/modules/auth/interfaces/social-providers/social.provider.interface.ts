import { ISocialUser } from './social-user.interface';

export interface ISocialAuthProvider {
  /**
   * @param data Data received from the social provider after authentication.
   * @returns A promise that resolves to an ISocialUser object containing user information.
   */
  verifyUser(data: unknown): Promise<ISocialUser>;
}
