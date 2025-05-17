import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinTable,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';     
import { Skill } from '../../skill/entities/skill.entity';
import { CvHistory } from '../../cv-history/entities/cv-history.entity';

@Entity()
export class Cv {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  firstname: string;

  @Column()
  age: number;

  @Column()
  cin: string;

  @Column()
  job: string;

  @Column()
  path: string;

  @ManyToOne(() => User, (user) => user.cvs)
  user: User;

  @ManyToMany(() => Skill, (skill) => skill.cvs, { cascade: true, eager: true })
  @JoinTable()
  skills: Skill[];

  @OneToMany(() => CvHistory, (history) => history.cv, {
    cascade: ['insert', 'update'],
  })
  histories: CvHistory[];

  @DeleteDateColumn({
    name: 'deleted_at',
    nullable: true,
  })
  deletedAt?: Date;
}
