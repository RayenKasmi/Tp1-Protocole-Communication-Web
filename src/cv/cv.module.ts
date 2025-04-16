import { Module } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cv } from './entities/cv.entity';
import { UserModule } from '../user/user.module';
import { SkillModule } from '../skill/skill.module';
import { SharedModule } from '../shared/shared.module';
import { MulterModule } from '@nestjs/platform-express';
import { ImageUploadConfigService } from '../shared/services/image-upload-config.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cv]),
    UserModule,
    SkillModule,
    MulterModule.registerAsync({
      imports: [SharedModule],
      useClass: ImageUploadConfigService,
    }),
  ],
  controllers: [CvController],
  providers: [CvService],
})
export class CvModule {}
