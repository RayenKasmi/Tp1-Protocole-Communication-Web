import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CvHistory } from './entities/cv-history.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CvHistoryService } from './cv-history.service';
import { CvHistoryController } from './cv-history.controller';
import { CvHistoryListener } from './cv-history.listener';
import { CvHistorySseController } from './cv-history-sse.controller';
import { SseService } from './sse.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CvHistory]),
    EventEmitterModule.forRoot(),
  ],
  providers: [CvHistoryService, CvHistoryListener, SseService],
  controllers: [CvHistoryController, CvHistorySseController],
  exports: [CvHistoryService],
})
export class CvHistoryModule {}
