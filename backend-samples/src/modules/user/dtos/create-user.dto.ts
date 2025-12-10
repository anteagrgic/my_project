import { IUser } from '../interfaces/user.interface';

export class CreateUserDto implements Partial<IUser> {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  profilePhotoUrl?: string;
  isVerified?: boolean;
  accountType?: string;
  trialStartDate?: string;
  trialEndDate?: string;
  subscriptionStatus?: string;
  notificationEmail?: boolean;
  notificationPush?: boolean;
  locationServices?: boolean;
  darkMode?: string;
  authProvider?: string;
  authProviderId?: string;
  lastLoginAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
