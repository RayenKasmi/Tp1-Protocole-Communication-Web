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

  async findAll(filter: FilterCvHistoryDto, userId: number): Promise<any[]> {
    const histories = await this.historyRepo.find({
      where: {
        ...filter,
        performedBy: { id: userId },
      },
      order: { performedAt: 'DESC' },
      relations: ['performedBy'],
    });

    return histories.map((h) => {
      const { password, salt, ...safeUser } = h.performedBy;
      return {
        ...h,
        performedBy: safeUser,
      };
    });
  }
}
