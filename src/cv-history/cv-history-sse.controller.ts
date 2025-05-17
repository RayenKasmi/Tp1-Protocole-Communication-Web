import { Controller, Sse, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
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
    return this.sse
      .getFilteredStream(user)
      .pipe(map((event) => ({ data: event })));
  }
}
