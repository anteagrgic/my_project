import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class VerifyPhoneDto {
  @ApiProperty({
    description: 'The phone number of the user',
    example: '+1234567890',
  })
  @IsPhoneNumber(null, { message: 'Should be a valid phone number' })
  @IsNotEmpty({ message: 'Phone must not be empty' })
  phoneNumber: string;

  @ApiProperty({ description: 'Code that is sent to user email' })
  @IsNotEmpty({ message: 'Code should not be empty' })
  @IsString({ message: 'Code should be a string' })
  code: string;
}
