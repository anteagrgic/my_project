import { InternalServerErrorException } from '@nestjs/common';
import { DrizzleAsyncProvider } from '../providers/drizzle.provider';

export abstract class AbstractTransaction<TInput, TOutput> {
  protected constructor(private readonly db: DrizzleAsyncProvider) {}

  protected abstract execute(
    data: TInput,
    tx: DrizzleAsyncProvider,
  ): Promise<TOutput>;

  /**
   * Runs transaction defined by execute method.
   * This method is called from the service, as a top-level transaction.
   *
   * @param data - Data to be passed to the transaction
   * @returns Result of the transaction
   */
  async run(data: TInput): Promise<TOutput> {
    try {
      return await this.db.transaction(async (tx) => {
        return await this.execute(data, tx);
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Transaction failed: ${error.message}`,
      );
    }
  }

  /**
   * Runs transaction defined by execute method.
   * This method is called from within another transaction, as a nested transaction.
   *
   * Transactional database instance from the parent transaction must be passed as an argument.
   *
   * @param data - Data to be passed to the transaction
   * @param tx - Transactional database instance from the parent transaction
   *
   * @returns Result of the transaction
   */
  async runWithinTransaction(
    data: TInput,
    tx: DrizzleAsyncProvider,
  ): Promise<TOutput> {
    return this.execute(data, tx);
  }
}
