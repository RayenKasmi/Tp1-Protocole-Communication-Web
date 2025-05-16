import { Controller, UseGuards, Sse, Post, Body } from '@nestjs/common';
import { CvSseService } from '../services/cv-sse.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Controller({
  path: 'cv-sse',
  version: '1',
})
export class CvSseController {
  constructor(private readonly sseService: CvSseService) { }

  @Sse('events')
  @UseGuards(JwtAuthGuard)
  sendEvents(@GetUser() user: any): Observable<{ data: any }> {
    return this.sseService.getFilteredStream(user).pipe(
      map((event) => ({
        data: event,
      })),
    );
  }
}