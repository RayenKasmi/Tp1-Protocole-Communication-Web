import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CvHistoryService } from './cv-history.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FilterCvHistoryDto } from './dto/fitler-cv-history.dto';

@Controller({ path: 'cv-history', version: '1' })
@UseGuards(JwtAuthGuard)
export class CvHistoryController {
  constructor(private readonly historyService: CvHistoryService) {}

  @Get()
  findAll(@Query() filter: FilterCvHistoryDto) {
    return this.historyService.findAll(filter);
  }
}
