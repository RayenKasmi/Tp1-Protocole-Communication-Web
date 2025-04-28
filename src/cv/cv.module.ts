import { Module } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { CvControllerV2 } from './cv.controller.v2';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cv } from './entities/cv.entity';
import { UserModule } from '../user/user.module';
import { SkillModule } from '../skill/skill.module';
import { CommonModule } from '../common/common.module';
import { MulterModule } from '@nestjs/platform-express';
import { ImageUploadConfigService } from '../common/services/image-upload-config.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cv]),
    UserModule,
    SkillModule,
    AuthModule,
    MulterModule.registerAsync({
      imports: [CommonModule],
      useClass: ImageUploadConfigService,
    }),
  ],
  controllers: [CvController, CvControllerV2],
  providers: [CvService],
})
export class CvModule {}
