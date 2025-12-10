import { PutObjectCommandOutput, S3 } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';

import { S3Config } from 'src/common/config/env.validation';
import { PropertyPilotExternalServiceException } from 'src/common/exceptions/custom.exception';

import { IFileStorageProvider } from './interface/file-storage-provider.interface';
import { IS3Params } from './interface/s3-params.interface';

@Injectable()
export class S3Service implements IFileStorageProvider {
  private s3Client: S3;

  constructor(private readonly config: S3Config) {
    this.s3Client = new S3({
      region: this.config.REGION,

      credentials: {
        secretAccessKey: this.config.SECRET,
        accessKeyId: this.config.ACCESSKEY,
      },
    });
  }

  /**
   * Uploads a file to the storage.
   * @param params - Params for uploading a file
   * @returns Third-party service response
   */

  public async upload(params: IS3Params): Promise<PutObjectCommandOutput> {
    try {
      return await this.s3Client.putObject({
        Bucket: this.config.BUCKET,
        ...params,
      });
    } catch (err: unknown) {
      throw new PropertyPilotExternalServiceException(
        'Photo upload failed, please try again',
      );
    }
  }

  /**
   * Delete a photo by key.
   * @note If a photo does not exist, returns an empty object
   * @param key - Key of the file to be deleted
   * @returns Void
   */
  public async delete(key: string): Promise<void> {
    try {
      await this.s3Client.deleteObject({
        Bucket: this.config.BUCKET,
        Key: key,
      });
    } catch (err: unknown) {
      throw new PropertyPilotExternalServiceException(
        'Photo deletion failed, please try again',
      );
    }
  }
}
