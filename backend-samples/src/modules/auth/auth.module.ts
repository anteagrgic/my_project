import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthEmailService } from './providers/auth-email.service';
import { AuthEmailServiceToken } from './interfaces/auth-email.service.interface';
import { AuthPhoneServiceToken } from './interfaces/auth-phone.service.interface';
import { EmailListenerServiceToken } from './interfaces/email-provider/email-listener.service.interface';
import { EmailServiceProviderToken } from './interfaces/email-provider/email-provider.service.interface.ts';
import { JWTProviderToken } from './interfaces/jwt-token/jwt-provider.service.interface';
import { TokenRepositoryToken } from './interfaces/jwt-token/token.repository.interface';
import { SmsListenerServiceToken } from './interfaces/phone-provider/sms-listener.service.interface';
import { SmsProviderToken } from './interfaces/phone-provider/sms-provider.service.interface';
import { VerificationCodeRepositoryToken } from './interfaces/verification-code/verification-code.repository';
import { AuthPhoneService } from './providers/auth-phone.service';
import { EmailListenerService } from './providers/email-provider/email-listener.service';
import { SendgridService } from './providers/email-provider/sendgrid.service';
import { JWTProvider } from './providers/jwt-token/jwt-provider.service';
import { TokenRepository } from './providers/jwt-token/token-repository';
import { SmsListener } from './providers/phone-provider/sms-listener.service';
import { TwilioService } from './providers/phone-provider/twilio.service';
import {
  AppleAuthProviderService,
  AppleAuthProviderToken,
} from './providers/social-providers/apple-auth.provider';
import {
  GoogleOAuthProvider,
  GoogleOAuthToken,
} from './providers/social-providers/google-auth.provider';
import { VerificationCodeRepository } from './providers/verification-code/verification-code.repository';
@Module({
  imports: [JwtModule.register({}), EventEmitterModule, UserModule],
  controllers: [AuthController],
  providers: [
    // Both Email and Phone auth services active
    {
      provide: AuthEmailServiceToken,
      useClass: AuthEmailService,
    },
    {
      provide: AuthPhoneServiceToken,
      useClass: AuthPhoneService,
    },
    {
      provide: VerificationCodeRepositoryToken,
      useClass: VerificationCodeRepository,
    },
    {
      provide: JWTProviderToken,
      useClass: JWTProvider,
    },
    {
      provide: TokenRepositoryToken,
      useClass: TokenRepository,
    },
    // Email Service Provider - SendGrid only
    {
      provide: EmailServiceProviderToken,
      useClass: SendgridService,
    },
    {
      provide: GoogleOAuthToken,
      useClass: GoogleOAuthProvider,
    },
    {
      provide: AppleAuthProviderToken,
      useClass: AppleAuthProviderService,
    },
    {
      provide: SmsProviderToken,
      useClass: TwilioService,
    },
    {
      provide: SmsListenerServiceToken,
      useClass: SmsListener,
    },
    {
      provide: EmailListenerServiceToken,
      useClass: EmailListenerService,
    },
  ],
  exports: [JWTProviderToken, GoogleOAuthToken],
})
export class AuthModule {}
