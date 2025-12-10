import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginCodeDto {
  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail({}, { message: 'Email should be a valid string' })
  email: string;

  @IsNotEmpty({ message: 'OTP code should not be empty' })
  @IsString({ message: 'OTP code should be a string' })
  otpCode: string;

  @IsString({ message: 'Firebase token must be a string' })
  @IsOptional({ message: 'Firebase token is optional' })
  firebaseToken?: string;
}
