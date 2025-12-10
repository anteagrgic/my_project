import { Inject, Injectable } from '@nestjs/common';
import * as Client from '@sendgrid/client';
import * as SendGrid from '@sendgrid/mail';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';

import {
  MailerConfig,
  SendgridConfig,
} from 'src/common/config/env.validation';

import {
  ISendEmailParams,
  TEmailProviderContent,
} from '../../interfaces/email-provider/email-provider.interface';
import { IEmailServiceProvider } from '../../interfaces/email-provider/email-provider.service.interface.ts';

@Injectable()
export class SendgridService implements IEmailServiceProvider {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: WinstonLogger,
    sendgridConfig: SendgridConfig,
    private readonly mailerConfig: MailerConfig,
  ) {
    SendGrid.setApiKey(sendgridConfig.APIKEY);
    Client.setApiKey(sendgridConfig.APIKEY);
  }

  /**
   * Sends an email using the SendGrid API.
   * Supports both static content (HTML/text) and dynamic templates.
   * @param msg - The message to be sent (static or dynamic template).
   * @returns Void
   */
  async sendEmail(
    msg: TEmailProviderContent | ISendEmailParams,
  ): Promise<void> {
    try {
      // Handle ISendEmailParams (convert to TEmailProviderContent)
      if ('bodyHtml' in msg) {
        const emailMsg: SendGrid.MailDataRequired = {
          to: msg.to,
          from: this.mailerConfig.EMAIL,
          subject: msg.subject,
          html: msg.bodyHtml || '',
        };
        await SendGrid.send(emailMsg);
        this.logger.log(
          `Email sent successfully via SendGrid to ${msg.to}`,
          SendgridService.name,
        );
        return;
      }

      // Handle TEmailProviderContent (static or dynamic template)
      await SendGrid.send(msg as SendGrid.MailDataRequired);
      this.logger.log(
        `Email sent successfully via SendGrid to ${msg.to}`,
        SendgridService.name,
      );
    } catch (err) {
      this.logger.setContext(SendgridService.name);
      this.logger.error('Failed to send email via SendGrid', err);
      if (err.response) {
        this.logger.error('SendGrid API response:', err.response.body);
      }
      throw err;
    }
  }
}
