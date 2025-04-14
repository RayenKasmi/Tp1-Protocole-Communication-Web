import { Module } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cv } from './entities/cv.entity';
import { UserModule } from '../user/user.module';
import { SkillModule } from '../skill/skill.module';
import { UploadsModule } from '../uploads/uploads.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cv]),
    UserModule,
    SkillModule,
    UploadsModule
  ],
  controllers: [CvController],
  providers: [CvService],
})
export class CvModule {}