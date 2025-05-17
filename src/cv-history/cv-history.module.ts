import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CvHistory } from './entities/cv-history.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CvHistoryService } from './cv-history.service';
import { CvHistoryController } from './cv-history.controller';
import { CvHistoryListener } from './cv-history.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature([CvHistory]),
    EventEmitterModule.forRoot(),
  ],
  providers: [CvHistoryService, CvHistoryListener],
  controllers: [CvHistoryController],
  exports: [CvHistoryService],
})
export class CvHistoryModule {}
