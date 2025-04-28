import { Module } from '@nestjs/common';
import { UuidService } from './services/uuid.service';
import { ImageUploadConfigService } from './services/image-upload-config.service';

@Module({
  providers: [UuidService, ImageUploadConfigService],
  exports: [UuidService],
})
export class CommonModule {}
