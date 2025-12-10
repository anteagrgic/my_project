import {
    ISendEmailParams,
    TEmailProviderContent,
} from './email-provider.interface';

export interface IEmailServiceProvider {
  /**
   * Sends an email.
   * @param params - Email parameters
   */
  sendEmail(msg: TEmailProviderContent | ISendEmailParams): Promise<void>;
}

export const EmailServiceProviderToken = Symbol('EmailServiceProviderToken');
