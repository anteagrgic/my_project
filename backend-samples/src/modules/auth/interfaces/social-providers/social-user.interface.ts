import { SocialProvider } from '../../enums/social-provider.enum';

export interface ISocialUser {
  firstName?: string;
  lastName?: string;
  email?: string;
  provider: SocialProvider;
  sub?: string;
  phone?: string;
}
