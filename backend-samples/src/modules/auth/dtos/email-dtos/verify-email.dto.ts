import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({ description: 'Email of the user' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail(undefined, { message: 'Email should be valid' })
  email: string;

  @ApiProperty({ description: 'Code that is sent to user email' })
  @IsNotEmpty({ message: 'Code should not be empty' })
  @IsString({ message: 'Code should be a string' })
  code: string;
}
