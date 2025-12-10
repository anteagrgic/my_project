import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestCodeDto {
  @ApiProperty({ description: 'Email of the user' })
  @IsNotEmpty({ message: 'Phone number should not be empty' })
  @IsEmail(undefined, { message: 'Phone number should be valid' })
  email: string;
}
