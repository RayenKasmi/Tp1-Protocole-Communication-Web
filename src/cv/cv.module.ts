import { Module } from '@nestjs/common';
import { CvService } from './services/cv.service';
import { CvController } from './controllers/cv.controller';
import { CvControllerV2 } from './controllers/cv.controller.v2';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cv } from './entities/cv.entity';
import { UserModule } from '../user/user.module';
import { SkillModule } from '../skill/skill.module';
import { SharedModule } from '../common/shared.module';
import { MulterModule } from '@nestjs/platform-express';
import { ImageUploadConfigService } from '../common/services/image-upload-config.service';
import { AuthModule } from '../auth/auth.module';
import { CvHistory } from './entities/cv-history.entity';
import { CvListener } from './cv.listener';
import { CvHistoryService } from './services/cv-history.service';
import { CvSseService } from './services/cv-sse.service';
import { CvSseController } from './controllers/sse-cv.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cv, CvHistory]),
    UserModule,
    SkillModule,
    AuthModule,
    MulterModule.registerAsync({
      imports: [SharedModule],
      useClass: ImageUploadConfigService,
    }),
  ],
  controllers: [CvController, CvControllerV2, CvSseController],
  providers: [CvService, CvListener, CvHistoryService, CvSseService],
})
export class CvModule {}
