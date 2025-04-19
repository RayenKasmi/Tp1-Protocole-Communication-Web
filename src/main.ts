import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';
import { VersioningType } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, 
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    }
  }));
  
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
  
  app.useStaticAssets(join(__dirname, '..', 'public'));

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '2',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
