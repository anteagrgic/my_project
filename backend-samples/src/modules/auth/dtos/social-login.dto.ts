import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { EnumUtils } from 'src/common/utils/enum.utils';

import { SocialProvider } from '../enums/social-provider.enum';

export class SocialLoginDto {
  @IsOptional()
  @ApiProperty({ description: 'Google provided code' })
  @IsString({ message: 'Code should be a string' })
  code?: string;

  @IsEnum(SocialProvider, {
    message: `Social Provider should be one of ${EnumUtils.enumToString(SocialProvider)}`,
  })
  @ApiProperty({
    description: 'The social provider to authenticate with',
    example: SocialProvider.GOOGLE,
  })
  provider: SocialProvider;

  @IsOptional()
  @ApiProperty({ description: 'Provided token' })
  @IsString({ message: 'Token should be a string' })
  idToken?: string;

  @ApiProperty({
    description: 'The Firebase token of the user',
    example: 'firebaseToken123',
  })
  @IsOptional({ message: 'Firebase token is optional' })
  @IsString({ message: 'Firebase token must be a string' })
  firebaseToken?: string;
}
