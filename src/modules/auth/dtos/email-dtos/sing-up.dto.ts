import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString } from 'class-validator';

import { LoginDto } from './login.dto';

export class SignUpDto extends LoginDto {
  @ApiProperty({ description: 'The first name of the user', example: 'John' })
  @IsString({ message: 'First name must be a string' })
  firstName: string;

  @ApiProperty({ description: 'The last name of the user', example: 'Doe' })
  @IsString({ message: 'Last name must be a string' })
  lastName: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '+1234567890',
    required: true,
  })
  @IsPhoneNumber(null, { message: 'Must be a valid phone number' })
  phoneNumber: string;
}
