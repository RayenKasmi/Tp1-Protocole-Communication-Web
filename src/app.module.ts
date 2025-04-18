import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CvModule } from './cv/cv.module';
import { SkillModule } from './skill/skill.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SharedModule } from './common/shared.module';
import { AuthMiddleware } from './common/middleware/auth.middleware';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { CvControllerV2 } from './cv/cv.controller.v2';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // No envFilePath needed since we're using Docker env vars
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT', { infer: true }),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, 
      }),
    }), 
    UserModule,
    CvModule,
    SkillModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer){
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        CvControllerV2
      )
  }
}
