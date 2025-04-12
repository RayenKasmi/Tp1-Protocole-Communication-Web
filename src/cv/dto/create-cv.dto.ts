import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength, ValidateNested } from 'class-validator';
import { User } from '../../user/entities/user.entity';
import { Skill } from '../../skill/entities/skill.entity';

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

  @IsOptional()
  @ValidateNested()
  @Type(() => User)
  user?: User;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Skill)
  skills?: Skill[];
}
