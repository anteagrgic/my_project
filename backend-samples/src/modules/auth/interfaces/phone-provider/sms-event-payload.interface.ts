import { IUser } from 'src/modules/user/interfaces/user.interface';

export interface IOtpPhonePayload {
  code: string;
  recipient: IUser;
}
