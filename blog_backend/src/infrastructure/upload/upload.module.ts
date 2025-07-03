import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';

@Module({
  imports: [
    MulterModule.register({
      // Use memory storage - simpler and works well for our use case
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1, // Only allow 1 file per request
      },
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
