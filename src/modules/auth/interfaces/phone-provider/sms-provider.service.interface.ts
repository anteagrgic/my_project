import { ISendSmsParams } from './sms-provider.interface';

export const SmsProviderToken = Symbol('SmsProvider');

export interface ISmsProvider {
  sendSms(data: ISendSmsParams): Promise<boolean>;
}
