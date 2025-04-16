import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import {
  MulterOptionsFactory,
  MulterModuleOptions,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UuidService } from '../services/uuid.service';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const UPLOAD_DIR = 'public/uploads/';
const MAX_IMAGE_SIZE = 1000000;

@Injectable()
export class ImageUploadConfigService implements MulterOptionsFactory {
  constructor(private readonly uuidService: UuidService) {}

  public createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: UPLOAD_DIR,
        filename: (_req, file, callback) => {
          const filename = `${this.uuidService.generate()}${extname(file.originalname)}`;
          callback(null, filename);
        },
      }),
      fileFilter: (_req, file, callback) => {
        const isValid = ALLOWED_IMAGE_TYPES.includes(file.mimetype);
        if (!isValid) {
          return callback(
            new UnprocessableEntityException(
              'Only jpeg, jpg or png images are allowed!',
            ),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: MAX_IMAGE_SIZE,
      },
    };
  }
}
