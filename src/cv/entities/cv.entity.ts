import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, JoinTable } from 'typeorm';
import { User } from '../../user/entities/user.entity';     
import { Skill } from '../../skill/entities/skill.entity';

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
}
