import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class TestEmailDto {
  @ApiProperty({
    description: 'Email address to send the test email to',
    example: 'test@example.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'First name for the test email',
    example: 'John',
  })
  @IsString()
  firstName!: string;

  @ApiProperty({
    description: 'Last name for the test email',
    example: 'Doe',
  })
  @IsString()
  lastName!: string;
}
