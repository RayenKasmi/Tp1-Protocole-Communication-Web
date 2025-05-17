import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BeforeInsert } from 'typeorm';
import { Cv } from '../../cv/entities/cv.entity';
import * as bcryptjs from 'bcryptjs';
import { Message } from 'src/messages/entities/message.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 20 })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @OneToMany(() => Cv, (cv) => cv.user)
  cvs: Cv[];

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @OneToMany(() => Message, (msg) => msg.sender)
  sentMessages: Message[];

  @OneToMany(() => Message, (msg) => msg.receiver)
  receivedMessages: Message[];

  @BeforeInsert()
  async hashPassword() {
    this.salt = await bcryptjs.genSalt();
    this.password = await bcryptjs.hash(this.password, this.salt);
  }
}
