import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CvHistoryService } from './services/cv-history.service';
import { CvEvent } from './events/cv-event';
import { CvSseService } from './services/cv-sse.service';


@Injectable()
export class CvListener {
    constructor(
        private readonly cvHistoryService: CvHistoryService,
        private readonly cvSseService: CvSseService,
    ){}

    @OnEvent('cv.action')
    async handleCvEvent(event: CvEvent) {

        await this.cvHistoryService.record(event);

        this.cvSseService.emitEvent(event)
    }
}
