import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { Events } from '../../enums/evets.enum';
import { IOtpPhonePayload } from '../../interfaces/phone-provider/sms-event-payload.interface';
import { ISmsListenerService } from '../../interfaces/phone-provider/sms-listener.service.interface';
import {
  ISmsProvider,
  SmsProviderToken,
} from '../../interfaces/phone-provider/sms-provider.service.interface';

@Injectable()
export class SmsListener implements ISmsListenerService {
  constructor(
    @Inject(SmsProviderToken) private readonly smsProvider: ISmsProvider,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  @OnEvent(Events.SMS_RESET_PASSWORD, { async: true })
  async handlePasswordResetSms(event: IOtpPhonePayload): Promise<void> {
    const sent = await this.smsProvider.sendSms({
      to: event.recipient.phone,
      body: `Your password reset code is: ${event.code}`,
    });
    if (!sent) {
      this.logger.error('Failed to send SMS');
    }
  }

  @OnEvent(Events.SMS_VERIFY_PHONE, { async: true })
  async handleVerificationSms(event: IOtpPhonePayload): Promise<void> {
    const sent = await this.smsProvider.sendSms({
      to: event.recipient.phone,
      body: `Your verification code is: ${event.code}`,
    });
    if (!sent) {
      this.logger.error('Failed to send SMS');
    }
  }
}
