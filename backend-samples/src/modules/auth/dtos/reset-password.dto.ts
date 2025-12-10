import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ description: 'Code from the password reset link query' })
  @IsNotEmpty({ message: 'Code should not be empty' })
  @IsString({ message: 'Code should be a string' })
  code: string;

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
}
