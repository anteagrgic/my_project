import { IEmailPayload } from './email-event-payload.interface';

export const EmailListenerServiceToken = Symbol('EmailListenerServiceToken');

export interface IEmailListenerService {
  /**
   * Handles the event of sending a password reset email.
   * @param payload - The payload containing the reset code and recipient email.
   * @returns A promise that resolves when the email has been handled.
   */
  handlePasswordResetEmail(payload: IEmailPayload): Promise<void>;

  /**
   * Handles the event of sending a verification email.
   * @param payload - The payload containing the verification code and recipient email.
   * @returns A promise that resolves when the email has been handled.
   */
  handleVerificationEmail(payload: IEmailPayload): Promise<void>;

  /**
   * Handles the event of sending a login code email.
   * @param payload - The payload containing the login code and recipient email.
   * @returns A promise that resolves when the email has been handled.
   */
  handleLoginCodeEmail(payload: IEmailPayload): Promise<void>;
}
