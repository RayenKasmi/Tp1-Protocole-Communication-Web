import { IsOptional, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterCvDto {
  @IsOptional()
  @IsString()
  criteria: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  age: number;
}
