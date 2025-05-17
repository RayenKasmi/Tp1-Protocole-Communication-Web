import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CV_HISTORY_EVENT } from './constants/cv-history.constants';
import { CvHistoryService } from './cv-history.service';

@Injectable()
export class CvHistoryListener {
  constructor(private readonly svc: CvHistoryService) {}

  @OnEvent(CV_HISTORY_EVENT)
  async handle(event: any) {
    await this.svc.log(event);
  }
}
