import { IsOptional, IsEnum, IsNumber } from 'class-validator';
import { CvHistoryEvent } from '../constants/cv-history.constants';

export class FilterCvHistoryDto {
  @IsOptional()
  @IsNumber()
  cvId?: number;

  @IsOptional()
  @IsEnum(CvHistoryEvent)
  eventType?: CvHistoryEvent;
}