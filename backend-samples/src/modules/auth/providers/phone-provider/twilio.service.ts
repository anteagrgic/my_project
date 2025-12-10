import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Twilio } from 'twilio';

import { TwilioConfig } from 'src/common/config/env.validation';

import { ISendSmsParams } from '../../interfaces/phone-provider/sms-provider.interface';
import { ISmsProvider } from '../../interfaces/phone-provider/sms-provider.service.interface';

@Injectable()
export class TwilioService implements ISmsProvider {
  private readonly twilioClient: Twilio;

  constructor(
    private readonly twilioConfig: TwilioConfig,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    this.twilioClient = new Twilio(
      this.twilioConfig.SID,
      this.twilioConfig.TOKEN,
    );
  }

  async sendSms(params: ISendSmsParams): Promise<boolean> {
    try {
      await this.twilioClient.messages.create({
        body: params.body,
        to: params.to,
        from: this.twilioConfig.PHONE,
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
