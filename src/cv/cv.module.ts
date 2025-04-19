import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { CvControllerV2 } from './cv.controller.v2';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cv } from './entities/cv.entity';
import { UserModule } from '../user/user.module';
import { SkillModule } from '../skill/skill.module';
import { SharedModule } from '../common/shared.module';
import { MulterModule } from '@nestjs/platform-express';
import { ImageUploadConfigService } from '../common/services/image-upload-config.service';
import { AuthMiddleware } from '../common/middleware/auth.middleware';

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
  controllers: [CvController, CvControllerV2],
  providers: [CvService],
})
export class CvModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(CvControllerV2);
  }
}
