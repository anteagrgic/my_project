import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'The phone number of the user',
    example: '+1234567890',
  })
  @IsPhoneNumber(null, { message: 'Should be a valid phone number' })
  @IsNotEmpty({ message: 'Phone number must not be empty' })
  phoneNumber: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'securePassword123',
  })
  @IsNotEmpty({ message: 'Password must not be empty' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/[a-z]/, {
    message: 'Password must contain at least one lowercase letter',
  })
  @Matches(/[\d!@#$%^&*(),.?":{}|<>]/, {
    message: 'Password must contain at least one number or special character',
  })
  password: string;

  @ApiProperty({
    description: 'The Firebase token of the user',
    example: 'firebaseToken123',
  })
  @IsString({ message: 'Firebase token must be a string' })
  @IsOptional({ message: 'Firebase token is optional' })
  firebaseToken?: string;
}
