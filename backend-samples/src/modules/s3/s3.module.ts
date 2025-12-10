import { Module } from '@nestjs/common';

import { FileStorageProviderToken } from './interface/file-storage-provider.interface';
import { S3Service } from './s3.service';

@Module({
  providers: [
    S3Service,
    {
      provide: FileStorageProviderToken,
      useExisting: S3Service,
    },
  ],
  exports: [FileStorageProviderToken],
})
export class S3Module {}
