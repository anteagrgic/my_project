import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'The refresh token',
    example: 'c8f5d6e7a8b9...',
  })
  @IsNotEmpty({ message: 'Refresh token must not be empty' })
  @IsString({ message: 'Refresh token must be a string' })
  refreshToken: string;
}
