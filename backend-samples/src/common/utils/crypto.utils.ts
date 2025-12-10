import * as crypto from 'crypto';

import { compare, genSalt, hash } from 'bcrypt';

const HASH_DEFAULT_ROUNDS = 10;
const TOKEN_DEFAULT_LENGTH = 10;

export class CryptoUtils {
  /**
   * Generates a hash from a text.
   */
  static async generateHash(
    password: string,
    rounds = HASH_DEFAULT_ROUNDS,
  ): Promise<string> {
    return await hash(password, await genSalt(rounds));
  }

  /**
   * Validates a text against a hash.
   */
  static async validateHash(text: string, hash: string): Promise<boolean> {
    return await compare(text, hash);
  }

  /**
   * Generates a token.
   */
  static generateToken(length = TOKEN_DEFAULT_LENGTH): string {
    return crypto.randomBytes(length / 2).toString('hex');
  }
}
