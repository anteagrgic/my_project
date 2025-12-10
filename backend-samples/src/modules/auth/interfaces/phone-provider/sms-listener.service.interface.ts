import { IOtpPhonePayload } from './sms-event-payload.interface';

export const SmsListenerServiceToken = Symbol('SmsListenerServiceToken');
export interface ISmsListenerService {
  /**
   * @param event - The event containing the phone number and message to be sent.
   * @returns A promise that resolves when the SMS has been handled.
   */
  handlePasswordResetSms(event: IOtpPhonePayload): Promise<void>;

  /**
   * @param event - The event containing the phone number and message to be sent.
   * @returns A promise that resolves when the SMS has been handled.
   */
  handleVerificationSms(event: IOtpPhonePayload): Promise<void>;
}
