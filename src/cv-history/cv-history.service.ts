import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CvHistory } from './entities/cv-history.entity';
import { CreateCvHistoryDto } from './dto/create-cv-history.dto';
import { FilterCvHistoryDto } from './dto/fitler-cv-history.dto';

@Injectable()
export class CvHistoryService {
  constructor(
    @InjectRepository(CvHistory)
    private readonly historyRepo: Repository<CvHistory>,
  ) {}

  async log(dto: CreateCvHistoryDto): Promise<CvHistory> {
    console.log(dto);
    const history = this.historyRepo.create({
      ...dto,
      performedBy: { id: dto.performedBy },
    });
    return this.historyRepo.save(history);
  }

  async findAll(filter: FilterCvHistoryDto): Promise<CvHistory[]> {
    return this.historyRepo.find({
      where: filter,
      order: { performedAt: 'DESC' },
    });
  }
}
