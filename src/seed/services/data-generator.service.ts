import {
  rand,
  randEmail,
  randFilePath,
  randFirstName,
  randJobTitle,
  randLastName,
  randNumber,
  randPassword,
  randSkill,
  randUserName,
} from '@ngneat/falso';
import { genSalt, hash } from 'bcryptjs';
import { DeepPartial } from 'typeorm';
import { User, UserRole } from '../../user/entities/user.entity';
import { Skill } from '../../skill/entities/skill.entity';
import { Cv } from '../../cv/entities/cv.entity';

const AGE_RANGE = { min: 18, max: 65 };
const CIN_MAX = 99999999;
const CIN_MIN = 10000000;

export class DataGeneratorService {
  private generateArray<T>(count: number, fn: () => T): T[] {
    return Array.from({ length: count }, fn);
  }

  private distinct<T>(arr: T[], keys: (keyof T)[]): T[] {
    return arr.filter((item, index, self) =>
      keys.every(
        (key) => self.findIndex((i) => i[key] === item[key]) === index,
      ),
    );
  }

  async generateUser(): Promise<DeepPartial<User>> {
    const salt = await genSalt();
    return {
      username: randUserName(),
      email: randEmail(),
      password: await hash(randPassword().toString(), salt),
      salt: salt,
      role: rand([UserRole.ADMIN, UserRole.USER, UserRole.USER, UserRole.USER]),
    };
  }

  generateUsers(count = 1): Promise<DeepPartial<User>[]> {
    return Promise.all(this.generateArray(count, () => this.generateUser()));
  }

  generateSkill(): DeepPartial<Skill> {
    return {
      designation: randSkill(),
    };
  }

  generateSkills(count = 1): DeepPartial<Skill>[] {
    return this.generateArray(count, () => this.generateSkill());
  }

  generateCvInfo(): DeepPartial<Cv> {
    return {
      firstname: randFirstName(),
      name: randLastName(),
      cin: randNumber({ min: CIN_MIN, max: CIN_MAX }).toString(),
    };
  }

  generateCvInfoWithUser(user: DeepPartial<User>): DeepPartial<Cv> {
    return { ...this.generateCvInfo(), user };
  }

  generateCvFromInfoWithUser(
    InfoCv: DeepPartial<Cv>,
    availableSkills: DeepPartial<Skill>[],
    maxSkillsPerCv: number,
  ): DeepPartial<Cv> {
    const skills = this.distinct(
      rand(availableSkills, {
        length: randNumber({
          max: Math.min(maxSkillsPerCv, availableSkills.length),
        }),
      }),
      ['id'],
    );

    return {
      ...InfoCv,
      age: randNumber(AGE_RANGE),
      job: randJobTitle(),
      path: randFilePath(),
      skills,
    };
  }

  async generateMultipleCvs(
    maxCvsPerUser: number,
    maxUsers: number,
    maxSkills: number,
    maxSkillsPerCv: number,
  ): Promise<{
    users: DeepPartial<User>[];
    skills: DeepPartial<Skill>[];
    cvs: DeepPartial<Cv>[];
  }> {
    const users = this.distinct(await this.generateUsers(maxUsers), [
      'username',
      'email',
    ]);
    const skills = this.distinct(this.generateSkills(maxSkills), [
      'designation',
    ]);

    const cvs = users.flatMap((user) => {
      const cvWithBaseInfo = this.generateCvInfoWithUser(user);
      const count = randNumber({ max: maxCvsPerUser });

      return this.generateArray(count, () =>
        this.generateCvFromInfoWithUser(cvWithBaseInfo, skills, maxSkillsPerCv),
      );
    });

    return { users, skills, cvs };
  }
}
