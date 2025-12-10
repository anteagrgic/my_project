import { ReadStream } from 'fs';

export class StreamUtils {
  /**
   * Reads a stream into a buffer.
   */
  static async readStreamToBuffer(readStream: ReadStream): Promise<Buffer> {
    const chunks: Buffer[] = [];

    for await (const chunk of readStream) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  }
}
