import { IRepository } from 'src/common/interfaces/repository.interface';

import {
  ICreateVerificationCode,
  IVerificationCode,
} from './verification-code.interface';

export const VerificationCodeRepositoryToken = Symbol(
  'VerificationCodeRepository',
);

export interface IVerificationCodeRepository
  extends IRepository<ICreateVerificationCode, IVerificationCode> {
  /**
   * Find a verification code by its code.
   * @param code
   * @return A promise that resolves to the verification code record if found
   */
  findByCode(code: string): Promise<IVerificationCode>;

  /**
   * Check if a verification code exists for a given user ID and code.
   * @param userId - ID of the user
   * @param code - verification code
   * @returns A promise that resolves to true if the code exists, false otherwise
   */
  findByUserAndCode(userId: string, code: string): Promise<IVerificationCode>;
}
