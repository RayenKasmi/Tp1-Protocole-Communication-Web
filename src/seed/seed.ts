import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataGeneratorService } from './services/data-generator.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cv } from '../cv/entities/cv.entity';
import { User } from '../user/entities/user.entity';
import { Skill } from '../skill/entities/skill.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const generatorService = new DataGeneratorService();

  const maxCvsPerUser = 4;
  const maxUsers = 20;
  const maxSkills = 30;
  const maxSkillsPerCv = 6;

  const { users, skills, cvs } = await generatorService.generateMultipleCvs(
    maxCvsPerUser,
    maxUsers,
    maxSkills,
    maxSkillsPerCv,
  );

  const userRepo = app.get(getRepositoryToken(User));
  const skillRepo = app.get(getRepositoryToken(Skill));
  const cvRepo = app.get(getRepositoryToken(Cv));

  await userRepo.save(users);
  await skillRepo.save(skills);
  await cvRepo.save(cvs);

  await app.close();
}

bootstrap();
