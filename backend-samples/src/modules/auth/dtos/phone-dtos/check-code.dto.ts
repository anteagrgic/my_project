import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

import { VerificationCodeType } from '../../interfaces/verification-code/verification-code.interface';

export class CheckCodeDto {
  @ApiProperty({ description: 'Email or phone of the user' })
  @IsNotEmpty({ message: 'Phone number should not be empty' })
  @IsPhoneNumber(null, { message: 'Phone number must be a string' })
  phone: string;

  @ApiProperty({ description: 'Code from the password reset link query' })
  @IsNotEmpty({ message: 'Code should not be empty' })
  @IsString({ message: 'Code should be a string' })
  code: string;

  @ApiProperty({
    description: 'Type of the verification code',
    enum: VerificationCodeType,
  })
  @IsNotEmpty({ message: 'Type should not be empty' })
  @IsString({ message: 'Type should be a string' })
  type: VerificationCodeType;
}
