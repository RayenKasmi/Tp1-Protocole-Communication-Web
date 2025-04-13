import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { GenericRepository } from '../shared/repositories/generic.repository';
import { Cv } from './entities/cv.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { SkillService } from '../skill/skill.service';
import { Skill } from '../skill/entities/skill.entity';

@Injectable()
export class CvService extends GenericRepository<Cv> {
  constructor(
    @InjectRepository(Cv) private readonly cvRepository: Repository<Cv>,
    private readonly userService: UserService,
    private readonly skillService: SkillService,
  ) {
    super(cvRepository);
  }

  async create(createCvDto: CreateCvDto): Promise<Cv> {
    const user = await this.userService.findOne(createCvDto.user.id);
    if (!user) {
      throw new NotFoundException(`User with ID ${createCvDto.user.id} not found`);
    }

    const skills: Skill[] = [];
    if (createCvDto.skills && createCvDto.skills.length > 0) {
      for (const skillDto of createCvDto.skills) {
        const existingSkill = await this.skillService.findOne(skillDto.id);
        if(!existingSkill) {
          throw new NotFoundException(`Skill with ID ${skillDto.id} not found`);
        }
        skills.push(existingSkill);        
      }
    }

    const cv = this.cvRepository.create({
      name: createCvDto.name,
      firstname: createCvDto.firstname, 
      age: createCvDto.age,
      cin: createCvDto.cin,
      job: createCvDto.job,
      path: createCvDto.path,
      user: user,
      skills: skills,
    });
    
    return this.cvRepository.save(cv);
  }

  async update(id: number, updateCvDto: UpdateCvDto): Promise<Cv> {
    const cv = await this.findOne(id);
    if (!cv) {
      throw new NotFoundException(`CV with ID ${id} not found`);
    }
    if (updateCvDto.skills) {
      const skills : Skill[] = [];
      for (const skillDto of updateCvDto.skills) {
        const existingSkill = await this.skillService.findOne(skillDto.id);
        if(!existingSkill) {
          throw new NotFoundException(`Skill with ID ${skillDto.id} not found`);
        }
        skills.push(existingSkill);
      }
      cv.skills = skills;
    }
    
    if (updateCvDto.name) cv.name = updateCvDto.name;
    if (updateCvDto.firstname) cv.firstname = updateCvDto.firstname;
    if (updateCvDto.age) cv.age = updateCvDto.age;
    if (updateCvDto.cin) cv.cin = updateCvDto.cin;
    if (updateCvDto.job) cv.job = updateCvDto.job;
    if (updateCvDto.path) cv.path = updateCvDto.path;
    
    return this.cvRepository.save(cv);
  }
}
