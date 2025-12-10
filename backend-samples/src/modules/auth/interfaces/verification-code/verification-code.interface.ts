import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import { VerificationCode } from 'src/common/drizzle/schema';

export interface ICreateVerificationCode
  extends InferInsertModel<VerificationCode> {}
export interface IVerificationCode extends InferSelectModel<VerificationCode> {}
export enum VerificationCodeType {
  PASSWORD_RESET = 'password_reset',
  VERIFICATION = 'verification',
  LOGIN = 'login',
}

export enum ResetPasswordType {
  DIGIT_CODE = '6_digit_code',
  RESET_LINK = 'reset_link',
}
