import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { GenericCrudService } from '../common/services/generic.crud.service';
import { Cv } from './entities/cv.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { SkillService } from '../skill/skill.service';
import { Skill } from '../skill/entities/skill.entity';
import { User, UserRole } from '../user/entities/user.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { FilterCvDto } from './dto/filter-cv.dto';

@Injectable()
export class CvService extends GenericCrudService<Cv> {
  constructor(
    @InjectRepository(Cv) private readonly cvRepository: Repository<Cv>,
    private readonly userService: UserService,
    private readonly skillService: SkillService,
  ) {
    super(cvRepository);
  }

  // async create(createCvDto: CreateCvDto): Promise<Cv> {
  //   const user = await this.userService.findOne(createCvDto.user.id);
  //   if (!user) {
  //     throw new NotFoundException(`User with ID ${createCvDto.user.id} not found`);
  //   }

  //   const skills: Skill[] = [];
  //   if (createCvDto.skills && createCvDto.skills.length > 0) {
  //     for (const skillDto of createCvDto.skills) {
  //       const existingSkill = await this.skillService.findOne(skillDto.id);
  //       if(!existingSkill) {
  //         throw new NotFoundException(`Skill with ID ${skillDto.id} not found`);
  //       }
  //       skills.push(existingSkill);
  //     }
  //   }

  //   const cv = this.cvRepository.create({
  //     ...createCvDto,
  //     user: user,
  //     skills: skills,
  //   });

  //   return this.cvRepository.save(cv);
  // }

  async createWithUser(createCvDto: CreateCvDto, user: any): Promise<Cv> {
    if (!user) {
      throw new NotFoundException(`User with ID ${user.userId} not found`);
    }

    const skills: Skill[] = [];
    if (createCvDto.skills && createCvDto.skills.length > 0) {
      for (const skillDto of createCvDto.skills) {
        const existingSkill = await this.skillService.findOne(skillDto.id);
        if (!existingSkill) {
          throw new NotFoundException(`Skill with ID ${skillDto.id} not found`);
        }
        skills.push(existingSkill);
      }
    }

    const cv = this.cvRepository.create({
      ...createCvDto,
      user: user.userId,
      skills: skills,
    });

    return this.cvRepository.save(cv);
  }

  async update(id: number, updateCvDto: UpdateCvDto): Promise<Cv> {
    try {
      const cv = await this.cvRepository.preload({
        id,
        ...updateCvDto,
      });

      if (!cv) {
        throw new NotFoundException(
          `Update failed: Cv with ID ${id} not found`,
        );
      }

      if (updateCvDto.skills) {
        const skills: Skill[] = [];
        for (const skillDto of updateCvDto.skills) {
          const existingSkill = await this.skillService.findOne(skillDto.id);
          if (!existingSkill) {
            throw new NotFoundException(
              `Skill with ID ${skillDto.id} not found`,
            );
          }
          skills.push(existingSkill);
        }
        cv.skills = skills;
      }
      return this.cvRepository.save(cv);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Update failed: ${error.message}`);
    }
  }

  async findAllByCriteria(
    user: User,
    filter: FilterCvDto,
    paginationQuery: PaginationQueryDto,
  ): Promise<Cv[]> {
    const { age, criteria } = filter || {};

    const where: any[] = [];

    const isAdmin = user.role === UserRole.ADMIN;

    const baseCondition = isAdmin ? {} : { user: { id: user.id } };

    if (criteria) {
      where.push(
        { ...baseCondition, name: ILike(`%${criteria}%`) },
        { ...baseCondition, firstname: ILike(`%${criteria}%`) },
        { ...baseCondition, job: ILike(`%${criteria}%`) },
      );
    }

    if (age !== undefined) {
      where.push({ ...baseCondition, age });
    }

    if (where.length === 0) {
      where.push(baseCondition);
    }

    return this.findAll({ where, paginationQuery });
  }
}
