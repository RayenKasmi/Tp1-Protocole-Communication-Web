import { BadRequestException } from '@nestjs/common';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength, ValidateNested, IsArray } from 'class-validator';

class UserIdDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  id: number;
}

class SkillIdDto {
  @IsNumber()
  @IsNotEmpty() 
  @Type(() => Number)
  id: number;
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
  @Type(() => UserIdDto)
  @ValidateNested()
  user: UserIdDto;

  @IsOptional()
  @Type(() => SkillIdDto)
  @IsArray()
  @ValidateNested({ each: true })
  skills?: SkillIdDto[];
}
