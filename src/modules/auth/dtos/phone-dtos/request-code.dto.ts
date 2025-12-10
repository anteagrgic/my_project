import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class RequestCodeDto {
  @ApiProperty({
    description: 'The phone number of the user',
    example: '+1234567890',
  })
  @IsPhoneNumber(null, { message: 'Should be a valid phone number' })
  @IsNotEmpty({ message: 'Phone must not be empty' })
  phoneNumber: string;
}
