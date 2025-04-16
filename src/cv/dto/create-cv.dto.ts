import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength, ValidateNested, IsArray } from 'class-validator';

// New DTOs for handling relationships by ID or full object
class UserIdDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  id: number;
}

class SkillIdDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  id?: number;
}

export class CreateCvDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  firstname: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  age: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  cin: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  job: string;

  @IsOptional()
  @IsString()
  path?: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => UserIdDto)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return JSON.parse(value);
    }
    return value;
  }, { toClassOnly: true })
  user: UserIdDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SkillIdDto)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [parsed];
    }
    return value;
  }, { toClassOnly: true })
  skills?: SkillIdDto[];
}
