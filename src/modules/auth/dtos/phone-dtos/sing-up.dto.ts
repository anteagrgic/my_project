import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

import { LoginDto } from './login.dto';

export class SignUpDto extends LoginDto {
  @ApiProperty({ description: 'The first name of the user', example: 'John' })
  @IsString({ message: 'First name must be a string' })
  firstName: string;

  @ApiProperty({ description: 'The last name of the user', example: 'Doe' })
  @IsString({ message: 'Last name must be a string' })
  lastName: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
    required: true,
  })
  @IsEmail({}, { message: 'Must be a valid email address' })
  email: string;
}
