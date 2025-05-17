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

@Module({
  imports: [
    TypeOrmModule.forFeature([Cv]),
    UserModule,
    SkillModule,
    AuthModule,
    MulterModule.registerAsync({
      imports: [SharedModule],
      useClass: ImageUploadConfigService,
    }),
  ],
  controllers: [CvController, CvControllerV2],
  providers: [CvService],
})
export class CvModule {}
