import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class LoginCodeDto {
  @IsNotEmpty({ message: 'Phone number should not be empty' })
  @IsPhoneNumber(null, { message: 'Should be a valid phone number' })
  phoneNumber: string;

  @IsNotEmpty({ message: 'OTP code should not be empty' })
  @IsString({ message: 'OTP code should be a string' })
  otpCode: string;

  @IsString({ message: 'Firebase token must be a string' })
  @IsOptional({ message: 'Firebase token is optional' })
  firebaseToken?: string;
}
