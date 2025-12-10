import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { parsePhoneNumber } from 'libphonenumber-js';
import { utc } from 'moment';

import { JwtConfig } from 'src/common/config/env.validation';
import {
  PropertyPilotConflictException,
  PropertyPilotForbiddenException,
  PropertyPilotNotFoundException,
} from 'src/common/exceptions/custom.exception';
import {
  IUserService,
  UserServiceToken,
} from 'src/modules/user/interfaces/user.service.interface';

import { CheckCodeDto } from '../dtos/phone-dtos/check-code.dto';
import { LoginCodeDto } from '../dtos/phone-dtos/login-code.dto';
import { LoginDto } from '../dtos/phone-dtos/login.dto';
import { RequestCodeDto } from '../dtos/phone-dtos/request-code.dto';
import { SignUpDto } from '../dtos/phone-dtos/sing-up.dto';
import { VerifyPhoneDto } from '../dtos/phone-dtos/verify-phone.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { SocialLoginDto } from '../dtos/social-login.dto';
import { Events } from '../enums/evets.enum';
import { SocialProvider } from '../enums/social-provider.enum';
import { IAuthPhoneService } from '../interfaces/auth-phone.service.interface';
import {
  IJWTProvider,
  JWTProviderToken,
} from '../interfaces/jwt-token/jwt-provider.service.interface';
import { ISocialUser } from '../interfaces/social-providers/social-user.interface';
import { ISocialAuthProvider } from '../interfaces/social-providers/social.provider.interface';
import { VerificationCodeType } from '../interfaces/verification-code/verification-code.interface';
import {
  IVerificationCodeRepository,
  VerificationCodeRepositoryToken,
} from '../interfaces/verification-code/verification-code.repository';
import { LoginResponse } from '../responses/login-response';
import { CryptoUtils } from '../utils/crypto.utils';
import { AppleAuthProviderToken } from './social-providers/apple-auth.provider';
import { GoogleOAuthToken } from './social-providers/google-auth.provider';

@Injectable()
export class AuthPhoneService implements IAuthPhoneService {
  // eslint-disable-next-line max-params
  constructor(
    @Inject(UserServiceToken)
    private readonly userService: IUserService,
    @Inject(JWTProviderToken)
    private readonly jwtProvider: IJWTProvider,
    private readonly jwtConfig: JwtConfig,
    @Inject(VerificationCodeRepositoryToken)
    private readonly verificationCodeRepository: IVerificationCodeRepository,
    @Inject(GoogleOAuthToken)
    private readonly googleOAuthProvider: ISocialAuthProvider,
    @Inject(AppleAuthProviderToken)
    private readonly appleAuthProvider: ISocialAuthProvider,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async signup(data: SignUpDto): Promise<LoginResponse> {
    // Check if user exists by phone or email
    const existingUserByPhone = await this.userService.findByPhone(
      data.phoneNumber,
    );
    const existingUserByEmail = await this.userService.findByEmail(data.email);

    if (existingUserByPhone) {
      throw new PropertyPilotConflictException(
        'User with provided phone number exists',
      );
    }

    if (existingUserByEmail) {
      throw new PropertyPilotConflictException(
        'User with provided email exists',
      );
    }

    const hashedPassword = await CryptoUtils.generateHash(data.password);

    // Format phone number to E.164 format
    const parsedPhone = parsePhoneNumber(data.phoneNumber);
    const formattedPhone = parsedPhone.format('E.164');

    const userToCreate = {
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: formattedPhone,
    };
    const createdUser = await this.userService.create(userToCreate);

    if (createdUser) {
      // Generate verification code for phone
      const phoneCode = CryptoUtils.generateNDigitCode(6);
      await this.verificationCodeRepository.create({
        userId: createdUser.id,
        code: phoneCode,
        type: VerificationCodeType.VERIFICATION,
        expiresAt: utc().add(2, 'days').toDate(),
      });

      // Generate verification code for email
      const emailCode = CryptoUtils.generateNDigitCode(6);
      await this.verificationCodeRepository.create({
        userId: createdUser.id,
        code: emailCode,
        type: VerificationCodeType.VERIFICATION,
        expiresAt: utc().add(2, 'days').toDate(),
      });

      // Send verification SMS
      this.eventEmitter.emit(Events.SMS_VERIFY_PHONE, {
        recipient: createdUser,
        code: phoneCode,
      });

      // Send verification email
      this.eventEmitter.emit(Events.EMAIL_VERIFY_EMAIL, {
        recipient: createdUser,
        code: emailCode,
      });

      const tokens = await this.jwtProvider.generatePairAndSave({
        id: createdUser.id,
        firebaseToken: data.firebaseToken,
      });
      return { ...tokens, emailIsVerified: false };
    } else {
      throw new PropertyPilotConflictException('Error creating user');
    }
  }

  async login(data: LoginDto): Promise<LoginResponse> {
    const user = await this.userService.findByPhone(data.phoneNumber);

    if (!user) {
      throw new PropertyPilotForbiddenException('Invalid credentials');
    }

    const isPasswordValid = await CryptoUtils.validateHash(
      data.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new PropertyPilotForbiddenException('Invalid credentials');
    }

    const tokens = await this.jwtProvider.generatePairAndSave({
      id: user.id,
      firebaseToken: data.firebaseToken,
    });

    return { ...tokens, emailIsVerified: user.isVerified };
  }

  async requestLoginCode(data: RequestCodeDto): Promise<void> {
    const user = await this.userService.findByPhone(data.phoneNumber);

    if (!user) {
      throw new PropertyPilotNotFoundException(
        'User with provided phone number not found',
      );
    }

    const code = CryptoUtils.generateNDigitCode(6);
    await this.verificationCodeRepository.create({
      userId: user.id,
      code,
      type: VerificationCodeType.LOGIN,
      expiresAt: utc()
        .add(this.jwtConfig.REFRESHEXPIRESINSECONDS, 's')
        .toDate(),
    });

    this.eventEmitter.emit(Events.SMS_LOGIN_CODE, {
      recipient: user,
      code,
    });
  }

  async loginWithCode(data: LoginCodeDto): Promise<LoginResponse> {
    const user = await this.userService.findByPhone(data.phoneNumber);

    if (!user) {
      throw new PropertyPilotForbiddenException('Invalid credentials');
    }

    const code = await this.verificationCodeRepository.findByUserAndCode(
      user.id,
      data.otpCode,
    );

    if (!code || code.type !== VerificationCodeType.LOGIN) {
      throw new PropertyPilotForbiddenException('Invalid OTP code');
    }

    if (code.expiresAt < new Date()) {
      throw new PropertyPilotForbiddenException('OTP code has expired');
    }

    await this.verificationCodeRepository.delete(code.id);

    const tokens = await this.jwtProvider.generatePairAndSave({
      id: user.id,
      firebaseToken: data.firebaseToken,
    });

    return { ...tokens, emailIsVerified: user.isVerified };
  }

  async verifyPhone(data: VerifyPhoneDto): Promise<void> {
    const code = await this.verificationCodeRepository.findByCode(data.code);

    if (!code || code.type !== VerificationCodeType.VERIFICATION) {
      throw new PropertyPilotForbiddenException('Invalid OTP code');
    }

    if (utc().isAfter(code.expiresAt)) {
      throw new PropertyPilotForbiddenException('OTP code has expired');
    }
    const user = await this.userService.findOne(code.userId);
    if (!user) {
      throw new PropertyPilotNotFoundException('User not found');
    }
    if (user.phone !== data.phoneNumber) {
      throw new PropertyPilotConflictException('Invalid code');
    }

    user.isVerified = true;
    await this.userService.update(user.id, user);
    await this.verificationCodeRepository.delete(code.id);
  }

  async logout(userId: string, firebaseToken: string): Promise<void> {
    // If firebaseToken is provided, delete only that token, else delete all tokens for the user
    if (firebaseToken) {
      await this.jwtProvider.deleteByUserAndFirebaseToken(
        userId,
        firebaseToken,
      );
      return;
    }
    await this.jwtProvider.deleteByUser(userId);
  }

  async requestPasswordReset(data: RequestCodeDto): Promise<void> {
    const user = await this.userService.findByPhone(data.phoneNumber);
    if (!user) {
      return;
    }
    const code = CryptoUtils.generateNDigitCode(6);

    await this.verificationCodeRepository.create({
      type: VerificationCodeType.PASSWORD_RESET,
      code,
      userId: user.id,
      expiresAt: utc()
        .add(this.jwtConfig.REFRESHEXPIRESINSECONDS, 's')
        .toDate(),
    });

    // Send password reset email using email service provider
    this.eventEmitter.emit(Events.SMS_RESET_PASSWORD, {
      recipient: user,
      code,
    });
  }

  async resetPassword(data: ResetPasswordDto): Promise<void> {
    const code = await this.verificationCodeRepository.findByCode(data.code);

    if (!code || code.type !== VerificationCodeType.PASSWORD_RESET) {
      throw new PropertyPilotForbiddenException('Invalid OTP code');
    }

    if (utc().isAfter(code.expiresAt)) {
      throw new PropertyPilotForbiddenException('OTP code has expired');
    }

    const user = await this.userService.findOne(code.userId);
    if (!user) {
      throw new PropertyPilotNotFoundException('User not found');
    }
    user.password = await CryptoUtils.generateHash(data.password);

    await this.userService.update(user.id, user);
    await this.verificationCodeRepository.delete(code.id);
    await this.jwtProvider.deleteRefreshTokensForUser(user.id);
  }

  async checkCode(data: CheckCodeDto): Promise<void> {
    const code = await this.verificationCodeRepository.findByCode(data.code);

    if (!code || utc().isAfter(code.expiresAt)) {
      throw new PropertyPilotConflictException('Invalid or expired code');
    }

    const user = await this.userService.findOne(code.userId);
    if (!user) {
      throw new PropertyPilotNotFoundException('User not found');
    }

    if (user.phone !== data.phone) {
      throw new PropertyPilotConflictException('Invalid code type');
    }
  }

  async resendVerifyPhone(userId: string): Promise<void> {
    const user = await this.userService.findOne(userId);

    const code = CryptoUtils.generateNDigitCode(6);
    await this.verificationCodeRepository.create({
      type: VerificationCodeType.VERIFICATION,
      code,
      userId,
      expiresAt: utc()
        .add(this.jwtConfig.REFRESHEXPIRESINSECONDS, 's')
        .toDate(),
    });

    // Send verification email using email service provider
    this.eventEmitter.emit(Events.SMS_VERIFY_PHONE, {
      recipient: user,
      code,
    });
  }

  async handleSocialLogin(data: SocialLoginDto): Promise<LoginResponse> {
    let userDetails: ISocialUser;
    switch (data.provider) {
      case SocialProvider.GOOGLE:
        userDetails = await this.googleOAuthProvider.verifyUser(data);
        break;
      case SocialProvider.APPLE:
        userDetails = await this.appleAuthProvider.verifyUser(data);
        break;
      default:
        throw new PropertyPilotForbiddenException(
          'Social provider not supported',
        );
    }

    let user = await this.userService.findByEmail(userDetails.email);
    if (!user) {
      user = await this.userService.create({
        email: userDetails.email,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        phone: userDetails.phone,
        isVerified: true,
        authProvider: data.provider,
      });
    }

    const tokens = await this.jwtProvider.generatePairAndSave({
      id: user.id,
      firebaseToken: data.firebaseToken,
    });

    return { ...tokens, emailIsVerified: true };
  }
}
