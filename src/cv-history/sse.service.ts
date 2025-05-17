import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CvEvent } from './interfaces/cv-event.interface';

@Injectable()
export class SseService {
  private stream$ = new Subject<CvEvent>();

  emit(event: CvEvent) {
    this.stream$.next({ ...event, timestamp: new Date() });
  }

  getStream(): Observable<CvEvent> {
    return this.stream$.asObservable();
  }

  getFilteredStream(user: any): Observable<CvEvent> {
    return this.getStream().pipe(
      filter((evt) => user.role === 'admin' || evt.performedBy === user.userId),
    );
  }
}