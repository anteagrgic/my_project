import { CheckCodeDto } from '../dtos/email-dtos/check-code.dto';
import { LoginCodeDto } from '../dtos/email-dtos/login-code.dto';
import { LoginDto } from '../dtos/email-dtos/login.dto';
import { RequestCodeDto } from '../dtos/email-dtos/request-code.dto';
import { SignUpDto } from '../dtos/email-dtos/sing-up.dto';
import { VerifyEmailDto } from '../dtos/email-dtos/verify-email.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { SocialLoginDto } from '../dtos/social-login.dto';
import { LoginResponse } from '../responses/login-response';

export const AuthEmailServiceToken = Symbol('AuthEmailServiceToken');

export interface IAuthEmailService {
  /**
   * Sign up a new user.
   * @param data - user credentials
   * @returns JWT tokens
   */
  signup(data: SignUpDto): Promise<LoginResponse>;

  /**
   * Log in an existing user.
   * @param data - user credentials
   * @returns JWT tokens
   */
  login(data: LoginDto): Promise<LoginResponse>;

  /**
   * Request a 6-digit code to be sent to the user's email.
   * @param data - email OTP request data
   */
  requestLoginCode(data: RequestCodeDto): Promise<void>;

  /**
   * Log in using a 6-digit code.
   * @param data - email OTP data
   * @returns JWT tokens
   */
  loginWithCode(data: LoginCodeDto): Promise<LoginResponse>;

  /**
   * Verify a user's email using a verification code.
   * @param data - verification code data
   */
  verifyEmail(data: VerifyEmailDto): Promise<void>;

  /**
   * Log out a user by invalidating their tokens.
   * @param userId - ID of the user to log out
   * @param firebaseToken - optional Firebase token to remove
   */
  logout(userId: string, firebaseToken?: string): Promise<void>;

  /**
   * Request a password reset by sending a reset code to the user's email.
   * @param data - password reset request data
   */
  requestPasswordReset(data: RequestCodeDto): Promise<void>;

  /**
   * Reset a user's password using a reset code.
   * @param data - password reset data
   */
  resetPassword(data: ResetPasswordDto): Promise<void>;

  /**
   * Check the validity of a verification code.
   * @param data - code verification data
   */
  checkCode(data: CheckCodeDto): Promise<void>;

  /**
   * Resend the email verification code to the user.
   * @param userId - ID of the user to resend the verification email to
   */
  resendVerifyEmail(userId: string): Promise<void>;

  /**
   * Handle social login using various providers.
   * @param data - social login data
   * @returns JWT tokens
   */
  handleSocialLogin(data: SocialLoginDto): Promise<LoginResponse>;
}
