import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CvHistory } from '../entities/cv-history.entity';
import { CvEvent } from '../events/cv-event';



@Injectable()
export class CvHistoryService {
  constructor(
    @InjectRepository(CvHistory)
    private readonly historyRepo: Repository<CvHistory>,
  ) {}

  async record(event: CvEvent) {
    const history = this.historyRepo.create({
      action: event.action,
      cvId: event.cvId,
      userId: event.userId,
    });
    await this.historyRepo.save(history);
  }
}
