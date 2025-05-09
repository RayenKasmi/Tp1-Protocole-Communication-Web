import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CvHistoryService } from './services/cv-history.service';
import { CvEvent } from './events/cv-event';


@Injectable()
export class CvListener {
    constructor(
        private readonly cvHistoryService: CvHistoryService,
    ){}

    @OnEvent('cv.action')
    async handleCvEvent(event: CvEvent) {
        await this.cvHistoryService.record(event);
    }
}
