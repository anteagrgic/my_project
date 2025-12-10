import { randomBytes } from 'crypto';

import * as bcrypt from 'bcrypt';

export class CryptoUtils {
  static async generateHash(data: string): Promise<string> {
    return bcrypt.hash(data, 10);
  }

  static async validateHash(data: string, hash: string): Promise<boolean> {
    return bcrypt.compare(data, hash);
  }

  static generateToken(length: number): string {
    return randomBytes(length).toString('hex');
  }

  static generateNDigitCode(digits: number): string {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(min + Math.random() * (max - min + 1)).toString();
  }
}
