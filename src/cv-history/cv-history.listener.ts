import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CV_HISTORY_EVENT } from './constants/cv-history.constants';
import { CvHistoryService } from './cv-history.service';
import { SseService } from './sse.service';
import { CvEvent } from './interfaces/cv-event.interface';

@Injectable()
export class CvHistoryListener {
  constructor(
    private readonly historySvc: CvHistoryService,
    private readonly sse: SseService,
  ) {}

  @OnEvent(CV_HISTORY_EVENT)
  async handle(event: any) {
    // log to database
    const logged = await this.historySvc.log(event);
    // emit over SSE
    const cvEvt: CvEvent = {
      cvId: logged.cv.id,
      eventType: event.eventType,
      performedBy: event.performedBy,
      snapshot: event.snapshot,
      timestamp: logged.performedAt,
    };
    this.sse.emit(cvEvt);
  }
}