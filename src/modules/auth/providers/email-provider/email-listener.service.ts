import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import {
  EmailProvider,
  FrontendConfig,
  MailerConfig,
  ProjectConfig,
} from 'src/common/config/env.validation';

import { Events } from '../../enums/evets.enum';
import { IEmailPayload } from '../../interfaces/email-provider/email-event-payload.interface';
import { IEmailListenerService } from '../../interfaces/email-provider/email-listener.service.interface';
import {
  EmailServiceProviderToken,
  IEmailServiceProvider,
} from '../../interfaces/email-provider/email-provider.service.interface.ts';

@Injectable()
export class EmailListenerService implements IEmailListenerService {
  // SendGrid dynamic template ID (provided by user)
  private readonly SENDGRID_TEMPLATE_ID = 'd-17c358a0d8a34798a66e4fba857bec7a';

  constructor(
    // Inject the dynamically selected email service provider
    @Inject(EmailServiceProviderToken)
    private readonly emailService: IEmailServiceProvider,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly mailerConfig: MailerConfig,
    private readonly projectConfig: ProjectConfig,
    private readonly frontendConfig: FrontendConfig,
  ) {}

  @OnEvent(Events.EMAIL_RESET_PASSWORD)
  async handlePasswordResetEmail(payload: IEmailPayload): Promise<void> {
    const resetLink = `${this.frontendConfig.URL}/reset-password?token=${payload.code}&email=${encodeURIComponent(
      payload.recipient.email,
    )}`;

    try {
      // Use SendGrid dynamic templates if SendGrid is the provider
      if (this.mailerConfig.PROVIDER === EmailProvider.SENDGRID) {
        await this.emailService.sendEmail({
          to: payload.recipient.email,
          from: this.mailerConfig.EMAIL,
          templateId: this.SENDGRID_TEMPLATE_ID,
          dynamicTemplateData: {
            firstName: payload.recipient.firstName,
            lastName: payload.recipient.lastName,
            resetLink: resetLink,
            code: payload.code,
            projectName: this.projectConfig.NAME,
            emailType: 'password_reset',
          },
        });
      } else {
        // Use inline HTML for Resend/SES
        await this.emailService.sendEmail({
          to: payload.recipient.email,
          subject: 'Reset Your Password',
          bodyHtml: `<p>Hello ${payload.recipient.firstName} ${payload.recipient.lastName}<p>
        <p> We received a request to reset your password for your ${this.projectConfig.NAME} account.
        You can reset your password by clicking the link below:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>Alternatively, you can use the following verification code to rest your password:
        <strong>${payload.code}</strong></p>
        <p> This code is valid for the next 10 minutes.</p>
        <p>If you didn't request a password reset, you can safely ignore this email - no changes will be made to your account.</p>
        <p>If you encounter any issues or need further assistance, please don't hesitate to contact our support team on this link.</p>
        <p>Best regards,<br/>Margins</p>`,
        });
      }
    } catch (error) {
      this.logger.error('Error sending password reset email:', error);
      throw error;
    }
  }

  @OnEvent(Events.EMAIL_VERIFY_EMAIL)
  async handleVerificationEmail(payload: IEmailPayload): Promise<void> {
    const verifyLink = `${this.frontendConfig.URL}/verify-email?code=${payload.code}&email=${encodeURIComponent(
      payload.recipient.email,
    )}`;

    try {
      // Use SendGrid dynamic templates if SendGrid is the provider
      if (this.mailerConfig.PROVIDER === EmailProvider.SENDGRID) {
        await this.emailService.sendEmail({
          to: payload.recipient.email,
          from: this.mailerConfig.EMAIL,
          templateId: this.SENDGRID_TEMPLATE_ID,
          dynamicTemplateData: {
            firstName: payload.recipient.firstName,
            lastName: payload.recipient.lastName,
            verifyLink: verifyLink,
            code: payload.code,
            projectName: this.projectConfig.NAME,
            emailType: 'email_verification',
          },
        });
      } else {
        // Use inline HTML for Resend/SES
        await this.emailService.sendEmail({
          to: payload.recipient.email,
          subject: 'Verify Your Email',
          bodyHtml: `<p>Hello ${payload.recipient.firstName} ${payload.recipient.lastName}<p>
        <p> Thanks for creating an account with ${this.projectConfig.NAME}.
        To complete your sign up, please confirm your email address by clicking the button below.</p>
        <a href="${verifyLink}">Verify Email</a>
        <p>Alternatively, you can use the following verification code to verify your email:
        <strong>${payload.code}</strong></p>
        <p>If you did not create an account, you can safely ignore this message.</p>
        <p>If you encounter any issues or need further assistance, please don't hesitate to contact our support team on this link.</p>
        <p>Best regards,<br/>Margins</p>`,
        });
      }
    } catch (error) {
      this.logger.error('Error sending verification email:', error);
      throw error;
    }
  }

  @OnEvent(Events.EMAIL_LOGIN_CODE)
  async handleLoginCodeEmail(payload: IEmailPayload): Promise<void> {
    const loginLink = `${this.frontendConfig.URL}/verify-email?code=${payload.code}&email=${encodeURIComponent(
      payload.recipient.email,
    )}`;

    try {
      // Use SendGrid dynamic templates if SendGrid is the provider
      if (this.mailerConfig.PROVIDER === EmailProvider.SENDGRID) {
        await this.emailService.sendEmail({
          to: payload.recipient.email,
          from: this.mailerConfig.EMAIL,
          templateId: this.SENDGRID_TEMPLATE_ID,
          dynamicTemplateData: {
            firstName: payload.recipient.firstName,
            lastName: payload.recipient.lastName,
            loginLink: loginLink,
            code: payload.code,
            projectName: this.projectConfig.NAME,
            emailType: 'login_code',
          },
        });
      } else {
        // Use inline HTML for Resend/SES
        await this.emailService.sendEmail({
          to: payload.recipient.email,
          subject: 'Your Login Code',
          bodyHtml: `<p>Hello ${payload.recipient.firstName} ${payload.recipient.lastName},</p>
        <p>We received a request to log in to your ${this.projectConfig.NAME} account.
        To complet login process, please login by clicking the button below.</p>
        <a href="${loginLink}">Login</a>
        <p>Alternatively, you can use the following login code to access your account:</p>
        <p>Your login code is: <strong>${payload.code}</strong></p>
        <p>This code is valid for the next 5 minutes. If you did not request this code, please ignore this email.</p>
        <p>If you encounter any issues or need further assistance, please don't hesitate to contact our support team on this link.</p>
        <p>Best regards,<br/>Margins</p>`,
        });
      }
    } catch (error) {
      this.logger.error('Error sending login code email:', error);
      throw error;
    }
  }
}
