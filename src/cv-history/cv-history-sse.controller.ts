// cv-history-sse.controller.ts
import { Controller, Sse, UseGuards } from '@nestjs/common';
import { Observable, interval, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { SseService } from './sse.service';
import { GetUser } from '../common/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cv-history')
export class CvHistorySseController {
  constructor(private readonly sse: SseService) {}

  @Sse('events')
  @UseGuards(JwtAuthGuard)
  sendEvents(@GetUser() user: any): Observable<{ data: any }> {
    const data$ = this.sse
      .getFilteredStream(user)
      .pipe(map(event => ({ data: event })));

    const heartbeat$ = interval(10_000).pipe(
      map(() => ({ data: null })),
    );

    return merge(data$, heartbeat$);
  }
}
