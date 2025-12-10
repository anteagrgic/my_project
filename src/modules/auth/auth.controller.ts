import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { PropertyPilotExceptionResponse } from 'src/common/exceptions/custom-exception.response';
import { PropertyPilotUnauthorizedException } from 'src/common/exceptions/custom.exception';

import { UserId } from './decorators/current-user.decorator';
import { SkipAuth } from './decorators/public-endpoint.decorator';
import { Events } from './enums/evets.enum';

// DTOs for email auth (aliased to avoid conflicts)
import { CheckCodeDto as EmailCheckCodeDto } from './dtos/email-dtos/check-code.dto';
import { LoginCodeDto as EmailLoginCodeDto } from './dtos/email-dtos/login-code.dto';
import { LoginDto as EmailLoginDto } from './dtos/email-dtos/login.dto';
import { RequestCodeDto as EmailRequestCodeDto } from './dtos/email-dtos/request-code.dto';
import { SignUpDto as EmailSignUpDto } from './dtos/email-dtos/sing-up.dto';
import { VerifyEmailDto } from './dtos/email-dtos/verify-email.dto';

// DTOs for phone auth (aliased to avoid conflicts)
import { CheckCodeDto as PhoneCheckCodeDto } from './dtos/phone-dtos/check-code.dto';
import { LoginCodeDto as PhoneLoginCodeDto } from './dtos/phone-dtos/login-code.dto';
import { LoginDto as PhoneLoginDto } from './dtos/phone-dtos/login.dto';
import { RequestCodeDto as PhoneRequestCodeDto } from './dtos/phone-dtos/request-code.dto';
import { SignUpDto as PhoneSignUpDto } from './dtos/phone-dtos/sing-up.dto';
import { VerifyPhoneDto } from './dtos/phone-dtos/verify-phone.dto';

// DTOs for both email and phone auth
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { SocialLoginDto } from './dtos/social-login.dto';
import { TestEmailDto } from './dtos/test-email.dto';

// Service interfaces
import {
  AuthEmailServiceToken,
  IAuthEmailService,
} from './interfaces/auth-email.service.interface';
import {
  AuthPhoneServiceToken,
  IAuthPhoneService,
} from './interfaces/auth-phone.service.interface';
import { LoginResponse } from './responses/login-response';

@ApiTags('Auth')
@ApiResponse({
  description: 'Non 2xx response',
  type: PropertyPilotExceptionResponse,
})
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthPhoneServiceToken)
    private readonly phoneAuthService: IAuthPhoneService,
    @Inject(AuthEmailServiceToken)
    private readonly emailAuthService: IAuthEmailService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // ==================== PHONE AUTH ENDPOINTS ====================

  @ApiOperation({ summary: 'Sign up with phone number and password' })
  @SkipAuth()
  @Post('phone/signup')
  @ApiOkResponse({
    description: 'User signed up successfully with phone',
    type: LoginResponse,
  })
  @ApiConflictResponse({
    description: 'Thrown when credentials are invalid',
    type: PropertyPilotUnauthorizedException,
  })
  @HttpCode(HttpStatus.OK)
  async phoneSignup(@Body() data: PhoneSignUpDto): Promise<LoginResponse> {
    return this.phoneAuthService.signup(data);
  }

  @ApiOperation({ summary: 'Login with phone number and password' })
  @SkipAuth()
  @Post('phone/login')
  @ApiOkResponse({
    description: 'User logged in successfully with phone',
    type: LoginResponse,
  })
  @HttpCode(HttpStatus.OK)
  async phoneLogin(@Body() data: PhoneLoginDto): Promise<LoginResponse> {
    return this.phoneAuthService.login(data);
  }

  @ApiOperation({ summary: 'Request phone login code' })
  @ApiNoContentResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Phone login code requested',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @SkipAuth()
  @Post('phone/request-login-code')
  phoneRequestLoginCode(@Body() data: PhoneRequestCodeDto) {
    return this.phoneAuthService.requestLoginCode(data);
  }

  @ApiOperation({ summary: 'Login with phone OTP code' })
  @SkipAuth()
  @Post('phone/login-with-code')
  @ApiOkResponse({
    description: 'User logged in successfully with phone code',
    type: LoginResponse,
  })
  @HttpCode(HttpStatus.OK)
  async phoneLoginWithCode(
    @Body() data: PhoneLoginCodeDto,
  ): Promise<LoginResponse> {
    return this.phoneAuthService.loginWithCode(data);
  }

  @ApiOperation({ summary: 'Verify phone number' })
  @ApiNoContentResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Phone verification done',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @SkipAuth()
  @Post('phone/verify')
  async phoneVerify(@Body() data: VerifyPhoneDto): Promise<void> {
    return this.phoneAuthService.verifyPhone(data);
  }

  @ApiOperation({ summary: 'Request phone password reset code' })
  @ApiNoContentResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Phone password reset requested',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @SkipAuth()
  @Post('phone/request-password-reset')
  phoneRequestPasswordReset(@Body() data: PhoneRequestCodeDto) {
    return this.phoneAuthService.requestPasswordReset(data);
  }

  @ApiOperation({ summary: 'Check phone password reset code' })
  @ApiNoContentResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Phone password reset code is valid',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @SkipAuth()
  @Post('phone/check-code')
  phoneCheckCode(@Body() data: PhoneCheckCodeDto) {
    return this.phoneAuthService.checkCode(data);
  }

  @ApiOperation({ summary: 'Resend phone verification code' })
  @ApiNoContentResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Phone verification code resent',
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('phone/resend-verify')
  async phoneResendVerify(@UserId() user: { userId: string }) {
    return this.phoneAuthService.resendVerifyPhone(user.userId);
  }

  // ==================== EMAIL AUTH ENDPOINTS ====================

  @ApiOperation({ summary: 'Sign up with email and password' })
  @SkipAuth()
  @Post('email/signup')
  @ApiOkResponse({
    description: 'User signed up successfully with email',
    type: LoginResponse,
  })
  @ApiConflictResponse({
    description: 'Thrown when credentials are invalid',
    type: PropertyPilotUnauthorizedException,
  })
  @HttpCode(HttpStatus.OK)
  async emailSignup(@Body() data: EmailSignUpDto): Promise<LoginResponse> {
    return this.emailAuthService.signup(data);
  }

  @ApiOperation({ summary: 'Login with email and password' })
  @SkipAuth()
  @Post('email/login')
  @ApiOkResponse({
    description: 'User logged in successfully with email',
    type: LoginResponse,
  })
  @HttpCode(HttpStatus.OK)
  async emailLogin(@Body() data: EmailLoginDto): Promise<LoginResponse> {
    return this.emailAuthService.login(data);
  }

  @ApiOperation({ summary: 'Request email login code' })
  @ApiNoContentResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Email login code requested',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @SkipAuth()
  @Post('email/request-login-code')
  emailRequestLoginCode(@Body() data: EmailRequestCodeDto) {
    return this.emailAuthService.requestLoginCode(data);
  }

  @ApiOperation({ summary: 'Login with email OTP code' })
  @SkipAuth()
  @Post('email/login-with-code')
  @ApiOkResponse({
    description: 'User logged in successfully with email code',
    type: LoginResponse,
  })
  @HttpCode(HttpStatus.OK)
  async emailLoginWithCode(
    @Body() data: EmailLoginCodeDto,
  ): Promise<LoginResponse> {
    return this.emailAuthService.loginWithCode(data);
  }

  @ApiOperation({ summary: 'Verify email address' })
  @ApiNoContentResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Email verification done',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @SkipAuth()
  @Post('email/verify')
  async emailVerify(@Body() data: VerifyEmailDto): Promise<void> {
    return this.emailAuthService.verifyEmail(data);
  }

  @ApiOperation({ summary: 'Request email password reset code' })
  @ApiNoContentResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Email password reset requested',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @SkipAuth()
  @Post('email/request-password-reset')
  emailRequestPasswordReset(@Body() data: EmailRequestCodeDto) {
    return this.emailAuthService.requestPasswordReset(data);
  }

  @ApiOperation({ summary: 'Check email password reset code' })
  @ApiNoContentResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Email password reset code is valid',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @SkipAuth()
  @Post('email/check-code')
  emailCheckCode(@Body() data: EmailCheckCodeDto) {
    return this.emailAuthService.checkCode(data);
  }

  @ApiOperation({ summary: 'Resend email verification code' })
  @ApiNoContentResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Email verification code resent',
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('email/resend-verify')
  async emailResendVerify(@UserId() user: { userId: string }) {
    return this.emailAuthService.resendVerifyEmail(user.userId);
  }

  // ==================== SHARED AUTH ENDPOINTS ====================

  @ApiOperation({ summary: 'Password reset (works for both email and phone)' })
  @ApiNoContentResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Password reset done',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @SkipAuth()
  @Post('password-reset')
  async resetPassword(@Body() data: ResetPasswordDto) {
    // Password reset works with the code - can be from either email or phone
    // Try phone service first, then email
    try {
      return await this.phoneAuthService.resetPassword(data);
    } catch {
      return await this.emailAuthService.resetPassword(data);
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'User logged out successfully' })
  async logout(
    @UserId() user: { userId: string },
    @Body('firebaseToken') firebaseToken: string,
  ): Promise<{ success: boolean }> {
    await this.phoneAuthService.logout(user.userId, firebaseToken);
    return { success: true };
  }

  @ApiOperation({ summary: 'Social signup or login (Google/Apple)' })
  @ApiOkResponse({
    description: 'Successfully created or logged in user',
    type: LoginResponse,
  })
  @HttpCode(HttpStatus.OK)
  @Post('social-auth')
  @SkipAuth()
  async socialSignupOrLogin(
    @Body() data: SocialLoginDto,
  ): Promise<LoginResponse> {
    return this.phoneAuthService.handleSocialLogin(data);
  }

  @ApiOperation({
    summary: 'Test SendGrid email integration',
    description:
      'Sends a test email using SendGrid. This endpoint is for testing purposes only.',
  })
  @ApiOkResponse({
    description: 'Test email sent successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Test email sent successfully' },
        provider: { type: 'string', example: 'sendgrid' },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Post('test-email')
  @SkipAuth()
  async testEmail(
    @Body() data: TestEmailDto,
  ): Promise<{ success: boolean; message: string; provider: string }> {
    // Emit a test email event (using password reset as example)
    this.eventEmitter.emit(Events.EMAIL_RESET_PASSWORD, {
      recipient: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      },
      code: 'TEST123456',
    });

    return {
      success: true,
      message: 'Test email sent successfully',
      provider: process.env.MAILER_PROVIDER || 'unknown',
    };
  }
}
