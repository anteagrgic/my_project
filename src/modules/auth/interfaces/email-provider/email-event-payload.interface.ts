import { IUser } from 'src/modules/user/interfaces/user.interface';

export interface IEmailPayload {
  code: string;
  recipient: IUser;
}
