/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IFileStorageProvider {
  /**
   * Uploads a file to the storage.
   * @param params - Params for uploading a file
   * @returns Third-party service response
   */
  upload(params: any): Promise<any>;

  /**
   * Deletes a photo by key.
   * @param key - Key of the file to be deleted
   * @returns Void
   */
  delete(key: string): Promise<void>;
}

export const FileStorageProviderToken = Symbol('FileStorageProviderToken');
