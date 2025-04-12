import { Injectable } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { GenericRepository } from 'src/shared/repositories/generic.repository';
import { Skill } from './entities/skill.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SkillService extends GenericRepository<Skill> {
  constructor(@InjectRepository(Skill) private readonly skillRepository: Repository<Skill>) {
    super(skillRepository);
  }
}
