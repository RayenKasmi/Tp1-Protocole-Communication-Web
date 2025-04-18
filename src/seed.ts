import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CvService } from './cv/cv.service';
import { UserService } from './user/user.service';
import { SkillService } from './skill/skill.service';
import {
  randEmail,
  randFullName,
  randFirstName,
  randUserName,
  randLastName,
  randJobTitle,
  randNumber,
  randSkill,
  randPassword,
} from '@ngneat/falso';

const MAX_CVS_PER_USER = 3;

import { Skill } from './skill/entities/skill.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userService = app.get(UserService);
  const cvService = app.get(CvService);
  const skillService = app.get(SkillService);

  console.log('Seeding database...');

  const skillDesignations = new Set<string>();
  while (skillDesignations.size < 20) {
    skillDesignations.add(randSkill());
  }

  const skills: Skill[] = [];
  for (const designation of skillDesignations) {
    const skill = await skillService.create({ designation });
    skills.push(skill);
  }

  for (let i = 0; i < 20; i++) {
    const fullName = randFullName();
    const email = randEmail();

    const user = await userService.create({
      username: randUserName().substring(0, 20),
      email,
      password: randPassword().toString(),
    });

    const numberOfCvs = randNumber({ min: 1, max: MAX_CVS_PER_USER });

    for (let j = 0; j < numberOfCvs; j++) {
      const randomSkills = [...skills]
        .sort(() => 0.5 - Math.random())
        .slice(0, randNumber({ min: 1, max: skills.length }));

      await cvService.create({
        name: randLastName(),
        firstname: randFirstName(),
        age: randNumber({ min: 20, max: 50 }),
        cin: randNumber({ min: 10000000, max: 99999999 }).toString(),
        job: randJobTitle(),
        path: 'uploads/sample.pdf',
        user: user,
        skills: randomSkills,
      });
    }
  }

  console.log('Seeding complete!');
  await app.close();
}

bootstrap();
