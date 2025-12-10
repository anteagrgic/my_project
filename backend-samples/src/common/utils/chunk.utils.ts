const DEFAULT_CHUNK_SIZE = 400;

export class ChunkUtils {
  /**
   * Splits an array into chunks of specified size.
   */
  static splitIntoChunks<T>(data: T[], size = DEFAULT_CHUNK_SIZE): T[][] {
    const blank: T[] = [];
    return data.reduce((result: T[][], token: T, i) => {
      const index = Math.floor(i / size);
      result[index] = blank.concat(
        result[index] || <T>(<unknown>[]),
        token,
      ) as T[];

      return result;
    }, []);
  }
}
