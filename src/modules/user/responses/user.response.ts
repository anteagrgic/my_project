import { IUser } from '../interfaces/user.interface';

export class UserResponse implements Partial<IUser> {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  profilePhotoUrl: string;
  accountType: string;
  trialStartDate: string;
  trialEndDate: string;
  subscriptionStatus: string;
  notificationEmail: boolean;
  notificationPush: boolean;
  locationServices: boolean;
  darkMode: string;
  authProvider: string;
  authProviderId: string;
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
