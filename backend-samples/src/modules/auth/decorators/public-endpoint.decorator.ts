import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const SKIP_AUTH_KEY = 'skipAuth';
export const SkipAuth = (): CustomDecorator<string> =>
  SetMetadata(SKIP_AUTH_KEY, true);
