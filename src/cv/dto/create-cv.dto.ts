import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength, ValidateNested, IsArray } from 'class-validator';

// New DTOs for handling relationships by ID or full object
class UserIdDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}

class SkillIdDto {
  @IsNumber()
  @IsOptional()
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

  @IsNotEmpty()
  @IsString()
  path: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => UserIdDto)
  user: UserIdDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SkillIdDto)
  skills?: SkillIdDto[];
}
