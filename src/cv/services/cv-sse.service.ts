import { Injectable } from '@nestjs/common';
import { Observable, Subject, filter, map } from 'rxjs';
import { CvEvent } from '../events/cv-event';


@Injectable()
export class CvSseService {
    private eventSubject = new Subject<CvEvent>();
    public readonly stream: Observable<CvEvent> = this.eventSubject.asObservable();


    emitEvent(event: CvEvent) {
        this.eventSubject.next(event);
    }

    getFilteredStream(user: any): Observable<CvEvent> {
        return this.stream.pipe(
            filter((event: CvEvent) => {
                if (user.role === 'admin') {
                    return true;
                }

                return event.userId === user.userId;
            }),
        );
    }
}