import { CvHistoryEvent } from '../constants/cv-history.constants';
import { IsEnum, IsJSON, IsNumber } from 'class-validator';
import { Cv } from '../../cv/entities/cv.entity';

export class CreateCvHistoryDto {
  cv: Cv;

  @IsEnum(CvHistoryEvent)
  eventType: CvHistoryEvent;

  @IsNumber()
  performedBy: number;

  @IsJSON()
  snapshot: Record<string, any>;
}
